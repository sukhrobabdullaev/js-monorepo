import Big from "big.js";
import {
  lsSet,
  tryParseJson,
  fromBase64,
  toBase64,
  canSignWithLAK,
  toBase58,
  fromBase58,
  lsGet,
  publicKeyFromPrivate,
  serializeTransaction,
  signHash,
  serializeSignedTransaction,
  privateKeyFromRandom,
  reExportBorshSchema, parseJsonFromBytes,
} from "@fastnear/utils";

import {
  _adapter,
  _state, getTxHistory,
  updateState,
  updateTxHistory,
} from "./state.js";

// get/set config
// reset transaction history
import {
  getConfig,
  setConfig,
  resetTxHistory,
} from "./state.js";

import { sha256 } from "@noble/hashes/sha2";
import * as reExportUtils from "@fastnear/utils";

Big.DP = 27;
export const MaxBlockDelayMs = 1000 * 60 * 60 * 6; // 6 hours

export function withBlockId(params: Record<string, any>, blockId?: string) {
  return blockId === "final" || blockId === "optimistic"
    ? {...params, finality: blockId}
    : blockId
      ? {...params, block_id: blockId}
      : {...params, finality: "optimistic"};
}

export async function queryRpc(method: string, params: Record<string, any> | any[]) {
  // (C) Instead of _config.nodeUrl, we do getConfig().nodeUrl
  const response = await fetch(getConfig().nodeUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `fastnear-${Date.now()}`,
      method,
      params,
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }
  return result.result;
}

// After TX is included
export function afterTxSent(txId: string) {
  const txHistory = getTxHistory();
  queryRpc("tx", {
    tx_hash: txHistory[txId].txHash,
    sender_account_id: txHistory[txId].tx.signerId,
    wait_until: "EXECUTED_OPTIMISTIC",
  })
    .then((result) => {
      const successValue = result?.status?.SuccessValue;
      updateTxHistory({
        txId,
        status: "Executed",
        result,
        successValue: successValue
          ? tryParseJson(fromBase64(successValue))
          : undefined,
        finalState: true,
      });
    })
    .catch((error) => {
      updateTxHistory({
        txId,
        status: "ErrorAfterIncluded",
        error: tryParseJson(error.message),
        finalState: true,
      });
    });
}

// TX sending
export function sendTxToRpc(
  signedTxBase64: string,
  waitUntil: string | undefined,
  txId: string
) {
  queryRpc("send_tx", {
    signed_tx_base64: signedTxBase64,
    wait_until: waitUntil ?? "INCLUDED",
  })
    .then((result) => {
      console.log("Transaction included:", result);
      updateTxHistory({
        txId,
        status: "Included",
        finalState: false,
      });
      afterTxSent(txId);
    })
    .catch((error) => {
      updateTxHistory({
        txId,
        status: "Error",
        error: tryParseJson(error.message),
        finalState: false,
      });
    });
}

// Types
export interface AccessKeyView {
  nonce: number;
  permission: any;
}

// Simple getters (unchanged)
export const accountId = () => {
  return _state.accountId;
};

export const publicKey = () => {
  return _state.publicKey;
};

// (B) config(...) uses getConfig(), setConfig(), resetTxHistory()
export const config = (newConfig?: Record<string, any>) => {
  const current = getConfig();
  if (newConfig) {
    if (newConfig.networkId && current.networkId !== newConfig.networkId) {
      // switch to new network
      setConfig(newConfig.networkId);

      // reset app state
      updateState({
        accountId: null,
        privateKey: null,
        lastWalletId: null,
      });
      lsSet("block", null);

      // clear transaction history
      resetTxHistory();
    }

    // merge new config
    setConfig({
      ...getConfig(),
      ...newConfig,
    });
  }

  return getConfig();
};

// Auth status
export const authStatus = (): string | Record<string, any> => {
  if (!_state.accountId) {
    return "SignedOut";
  }

  // Check for limited access key
  const accessKey = _state.publicKey;
  const contractId = _state.accessKeyContractId;
  if (accessKey && contractId && _state.privateKey) {
    return {
      type: "SignedInWithLimitedAccessKey",
      accessKey,
      contractId,
    };
  }
  return "SignedIn";
};

// Query methods
export const view = async ({
                             contractId,
                             methodName,
                             args,
                             argsBase64,
                             blockId,
                           }: {
  contractId: string;
  methodName: string;
  args?: any;
  argsBase64?: string;
  blockId?: string;
}) => {
  const encodedArgs = argsBase64 || (args ? toBase64(JSON.stringify(args)) : "");
  const result = await queryRpc(
    "query",
    withBlockId(
      {
        request_type: "call_function",
        account_id: contractId,
        method_name: methodName,
        args_base64: encodedArgs,
      },
      blockId
    )
  );
  return parseJsonFromBytes(result.result);
};

export const account = async ({
                                accountId,
                                blockId,
                              }: {
  accountId: string;
  blockId?: string;
}) => {
  return queryRpc(
    "query",
    withBlockId(
      {
        request_type: "view_account",
        account_id: accountId,
      },
      blockId
    )
  );
};

export const block = async ({blockId}: { blockId?: string }) => {
  return queryRpc("block", withBlockId({}, blockId));
};

export const accessKey = async ({
                                  accountId,
                                  publicKey,
                                  blockId,
                                }: {
  accountId: string;
  publicKey: string;
  blockId?: string;
}): Promise<AccessKeyView> => {
  return queryRpc(
    "query",
    withBlockId(
      {
        request_type: "view_access_key",
        account_id: accountId,
        public_key: publicKey,
      },
      blockId
    )
  );
};

export const tx = async ({
                           txHash,
                           accountId,
                         }: {
  txHash: string;
  accountId: string;
}) => {
  return queryRpc("tx", [txHash, accountId]);
};

// If you want local TX history:
export const localTxHistory = () => {
  return getTxHistory();
};

// Transaction methods
export const sendTx = async ({
                               receiverId,
                               actions,
                               waitUntil,
                             }: {
  receiverId: string;
  actions: any[];
  waitUntil?: string;
}) => {
  const signerId = _state.accountId;
  if (!signerId) {
    throw new Error("Not signed in");
  }

  const publicKey = _state.publicKey;
  const privateKey = _state.privateKey;
  const txId = `tx-${Date.now()}-${Math.random()}`;

  if (
    !privateKey ||
    receiverId !== _state.accessKeyContractId ||
    !canSignWithLAK(actions)
  ) {
    const jsonTransaction = {
      signerId,
      receiverId,
      actions,
    };

    updateTxHistory({
      status: "Pending",
      txId,
      tx: jsonTransaction,
      finalState: false,
    });

    const url = new URL(typeof window !== "undefined" ? window.location.href : "");
    url.searchParams.set("txIds", txId);

    _adapter
      .sendTransactions({
        transactions: [jsonTransaction],
        callbackUrl: url.toString(),
      })
      .then((result: any) => {
        console.log("Transaction result:", result);
        if (result.url) {
          console.log("Redirecting to wallet:", result.url);
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.href = result.url;
            }, 100);
          }
        } else if (result.outcomes) {
          result.outcomes.forEach((r: any) => {
            updateTxHistory({
              txId,
              status: "Executed",
              result: r,
              txHash: r.transaction.hash,
              finalState: true,
            });
          });
        } else if (result.rejected) {
          updateTxHistory({
            txId,
            status: "RejectedByUser",
            finalState: true,
          });
        } else if (result.error) {
          updateTxHistory({
            txId,
            status: "Error",
            error: tryParseJson(result.error),
            finalState: true,
          });
        }
      })
      .catch((error: any) => {
        updateTxHistory({
          txId,
          status: "Error",
          error: tryParseJson(error.message),
          finalState: true,
        });
      });
    return txId;
  }

  let nonce: number | null = lsGet("nonce") as any;
  let block: any = lsGet("block") as any;
  const toDoPromises: Record<string, Promise<any>> = {};

  if (nonce === null || nonce === undefined) {
    toDoPromises.nonce = accessKey({
      accountId: signerId,
      publicKey,
    }).then((accessKey) => {
      if ((accessKey as any).error) {
        throw new Error(`Access key error: ${(accessKey as any).error}`);
      }
      lsSet("nonce", accessKey.nonce);
      return accessKey.nonce;
    });
  }

  if (
    !block ||
    !block.header ||
    parseFloat(block.header.timestamp_nanosec) / 1e6 + MaxBlockDelayMs <
    Date.now()
  ) {
    toDoPromises.block = block({blockId: "final"}).then((b: any) => {
      const newBlock = {
        header: {
          prev_hash: b.header.prev_hash,
          timestamp_nanosec: b.header.timestamp_nanosec,
        },
      };
      lsSet("block", newBlock);
      return newBlock;
    });
  }

  if (Object.keys(toDoPromises).length > 0) {
    const results = await Promise.all(Object.values(toDoPromises));
    const keys = Object.keys(toDoPromises);
    results.forEach((res, i) => {
      if (keys[i] === "nonce") {
        nonce = res;
      } else if (keys[i] === "block") {
        block = res;
      }
    });
  }

  const newNonce = (nonce ?? 0) + 1;
  lsSet("nonce", newNonce);
  const blockHash = block.header.prev_hash;

  const jsonTransaction = {
    signerId,
    publicKey,
    nonce: newNonce,
    receiverId,
    blockHash,
    actions,
  };

  console.log("Transaction:", jsonTransaction);
  const transaction = serializeTransaction(jsonTransaction);
  const txHash = toBase58(sha256(transaction));
  const signature = signHash(txHash, privateKey);
  const signedTransaction = serializeSignedTransaction(jsonTransaction, signature);
  const signedTxBase64 = toBase64(signedTransaction);

  updateTxHistory({
    status: "Pending",
    txId,
    tx: jsonTransaction,
    signature,
    signedTxBase64,
    txHash,
    finalState: false,
  });

  sendTxToRpc(signedTxBase64, waitUntil, txId);

  return txId;
};

// Authentication
export const requestSignIn = async ({contractId}: { contractId: string }) => {
  const privateKey = privateKeyFromRandom();
  updateState({
    accessKeyContractId: contractId,
    accountId: null,
    privateKey,
  });
  const publicKey = publicKeyFromPrivate(privateKey);
  const result = await _adapter.signIn({
    networkId: getConfig().networkId, // (C) replaced _config.networkId
    contractId,
    publicKey,
  });
  console.log("Sign in result:", result);
  if (result.error) {
    throw new Error(`Wallet error: ${result.error}`);
  }
  if (result.url) {
    console.log("Redirecting to wallet:", result.url);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = result.url;
      }, 100);
    }
  } else if (result.accountId) {
    updateState({
      accountId: result.accountId,
    });
  }
};

export const signOut = () => {
  updateState({
    accountId: null,
    privateKey: null,
    contractId: null,
  });
  // TODO: Implement actual wallet sign-out
};

// action helpers
export const actions = {
  functionCall: ({
                   methodName,
                   gas,
                   deposit,
                   args,
                   argsBase64,
                 }: {
    methodName: string;
    gas?: string;
    deposit?: string;
    args?: Record<string, any>;
    argsBase64?: string;
  }) => ({
    type: "FunctionCall",
    methodName,
    args,
    argsBase64,
    gas,
    deposit,
  }),

  transfer: (yoctoAmount: string) => ({
    type: "Transfer",
    deposit: yoctoAmount,
  }),

  stakeNEAR: ({amount, publicKey}: { amount: string; publicKey: string }) => ({
    type: "Stake",
    stake: amount,
    publicKey,
  }),

  addFullAccessKey: ({publicKey}: { publicKey: string }) => ({
    type: "AddKey",
    publicKey: publicKey,
    accessKey: {permission: "FullAccess"},
  }),

  addLimitedAccessKey: ({
                          publicKey,
                          allowance,
                          accountId,
                          methodNames,
                        }: {
    publicKey: string;
    allowance: string;
    accountId: string;
    methodNames: string[];
  }) => ({
    type: "AddKey",
    publicKey: publicKey,
    accessKey: {
      permission: "FunctionCall",
      allowance,
      receiverId: accountId,
      methodNames,
    },
  }),

  deleteKey: ({publicKey}: { publicKey: string }) => ({
    type: "DeleteKey",
    publicKey,
  }),

  deleteAccount: ({beneficiaryId}: { beneficiaryId: string }) => ({
    type: "DeleteAccount",
    beneficiaryId,
  }),

  createAccount: () => ({
    type: "CreateAccount",
  }),

  deployContract: ({codeBase64}: { codeBase64: string }) => ({
    type: "DeployContract",
    codeBase64,
  }),
};


export const reExports = {
  utils: reExportUtils,
  borshSchema: reExportBorshSchema,
};

// It's worth it to "symlink" so near.utils works
export const utils = reExports.utils;

// Handle wallet redirect if applicable
try {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const accountId = url.searchParams.get("account_id");
    const publicKey = url.searchParams.get("public_key");
    const errorCode = url.searchParams.get("errorCode");
    const errorMessage = url.searchParams.get("errorMessage");
    const transactionHashes = url.searchParams.get("transactionHashes");
    const txIds = url.searchParams.get("txIds");

    if (errorCode || errorMessage) {
      console.warn(new Error(`Wallet error: ${errorCode} ${errorMessage}`));
    }

    if (accountId && publicKey) {
      if (publicKey === _state.publicKey) {
        updateState({
          accountId,
        });
      } else {
        console.error(
          new Error("Public key mismatch from wallet redirect"),
          publicKey,
          _state.publicKey
        );
      }
    }

    if (transactionHashes || txIds) {
      const txHashes = transactionHashes ? transactionHashes.split(",") : [];
      const txIdsArray = txIds ? txIds.split(",") : [];
      if (txIdsArray.length > txHashes.length) {
        txIdsArray.forEach((txId, i) => {
          updateTxHistory({
            txId,
            status: "RejectedByUser",
            finalState: true,
          });
        });
      } else if (txIdsArray.length === txHashes.length) {
        txIdsArray.forEach((txId, i) => {
          updateTxHistory({
            txId,
            status: "PendingGotTxHash",
            txHash: txHashes[i],
            finalState: false,
          });
          afterTxSent(txId);
        });
      } else {
        console.error(
          new Error("Transaction hash mismatch from wallet redirect"),
          txIdsArray,
          txHashes
        );
      }
    }

    // Remove wallet parameters from the URL
    url.searchParams.delete("account_id");
    url.searchParams.delete("public_key");
    url.searchParams.delete("errorCode");
    url.searchParams.delete("errorMessage");
    url.searchParams.delete("all_keys");
    url.searchParams.delete("transactionHashes");
    url.searchParams.delete("txIds");
    window.history.replaceState({}, "", url.toString());
  }
} catch (e) {
  console.error("Error handling wallet redirect:", e);
}
