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
  reExportBorshSchema,
  parseJsonFromBytes,
} from "@fastnear/utils";

import {
  _adapter,
  _state, DEFAULT_NETWORK_ID,
  getTxHistory, NETWORKS,
  updateState,
  updateTxHistory,
} from "./state.js";

import {
  getConfig,
  setConfig,
  resetTxHistory,
} from "./state.js";

import * as stateExports from "./state.js";
import { sha256 } from "@noble/hashes/sha2";
import * as reExportUtils from "@fastnear/utils";

export * from "./state.js"

Big.DP = 27;
export const MaxBlockDelayMs = 1000 * 60 * 60 * 6; // 6 hours

export function withBlockId(params: Record<string, any>, blockId?: string) {
  return blockId === "final" || blockId === "optimistic"
    ? { ...params, finality: blockId }
    : blockId
      ? { ...params, block_id: blockId }
      : { ...params, finality: "optimistic" };
}

export async function queryRpc(method: string, params: Record<string, any> | any[]) {
  const config = getConfig();

  if (!config?.nodeUrl) {
    throw new Error("🚨 getConfig() returned an invalid config! nodeUrl is missing.");
  }

  const response = await fetch(config.nodeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    tx_hash: txHistory[txId]?.txHash,
    sender_account_id: txHistory[txId]?.tx?.signerId,
    wait_until: "EXECUTED_OPTIMISTIC",
  })
    .then((result) => {
      const successValue = result?.status?.SuccessValue;
      updateTxHistory({
        txId,
        status: "Executed",
        result,
        successValue: successValue ? tryParseJson(fromBase64(successValue)) : undefined,
        finalState: true,
      });
    })
    .catch((error) => {
      updateTxHistory({
        txId,
        status: "ErrorAfterIncluded",
        error: tryParseJson(error.message) ?? error.message,
        finalState: true,
      });
    });
}

// TX sending
export function sendTxToRpc(signedTxBase64: string, waitUntil: string | undefined, txId: string) {
  console.log("Sending TX to RPC:", { signedTxBase64, waitUntil, txId });

  queryRpc("send_tx", {
    signed_tx_base64: signedTxBase64,
    wait_until: waitUntil || "INCLUDED",
  })
    .then((result) => {
      console.log("Transaction included:", result);
      updateTxHistory({ txId, status: "Included", finalState: false });
      afterTxSent(txId);
    })
    .catch(async (error) => {
      console.error("RPC Transaction Error:", error);

      updateTxHistory({
        txId,
        status: "Error",
        error: tryParseJson(error.message) ?? error.message,
        finalState: false,
      });
    });
}

export interface AccessKeyView {
  nonce: number;
  permission: any;
}

// Securely generate a unique transaction ID
// todo check this
export function generateTxId(): string {
  const randomPart = crypto.getRandomValues(new Uint32Array(2)).join('');

  return `tx-${Date.now()}-${parseInt(randomPart, 10).toString(36)}`;
}

export const accountId = () => {
  return _state.accountId;
};

export const publicKey = () => {
  return _state.publicKey;
};

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
}

// Auth status
export const authStatus = (): string | Record<string, any> => {
  if (!_state.accountId) {
    return "SignedOut";
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
  }
  return 'SignedIn'
}

// Authentication
export const requestSignIn = async ({ contractId }: { contractId: string }) => {
  const privateKey = privateKeyFromRandom();
  updateState({ accessKeyContractId: contractId, accountId: null, privateKey });
  const publicKey = publicKeyFromPrivate(privateKey);

  const result = await _adapter.signIn({
    networkId: getConfig().networkId,
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
    updateState({ accountId: result.accountId });
  }
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

// consider renaming so people know this is an rpc query
export const tx = async ({
                           txHash,
                           accountId,
                         }: {
  txHash: string;
  accountId: string;
}) => {
  return queryRpc("tx", [txHash, accountId]);
};

export const localTxHistory = () => {
  return getTxHistory();
}

export const signOut = () => {
  updateState({
    accountId: null,
    privateKey: null,
    contractId: null,
  });

  setConfig(NETWORKS[DEFAULT_NETWORK_ID]); // ✅ Reset config to mainnet
};

export const sendTx = async ({
                               receiverId,
                               actions,
                               waitUntil,
                             }: {
  receiverId: string;
  actions: any[];
  waitUntil?: string;
}) => {
  console.log("🚀 Starting sendTx");
  console.log("📌 Inputs:", { receiverId, actions, waitUntil });

  const signerId = _state.accountId;
  if (!signerId) {
    throw new Error("❌ Not signed in");
  }

  const publicKey = _state.publicKey;
  const privateKey = _state.privateKey;
  const txId = generateTxId();

  console.log("🔑 Signer Info:", { signerId, publicKey, privateKey });

  if (!privateKey || receiverId !== _state.accessKeyContractId || !canSignWithLAK(actions)) {
    const jsonTransaction = { signerId, receiverId, actions };
    console.log("📝 jsonTransaction (unauthenticated flow):", jsonTransaction);

    updateTxHistory({ status: "Pending", txId, tx: jsonTransaction, finalState: false });

    const url = new URL(typeof window !== "undefined" ? window.location.href : "");
    url.searchParams.set("txIds", txId);

    try {
      const result: {
        url?: string;
        outcomes?: Array<{ transaction: { hash: string } }>;
        rejected?: boolean;
        error?: string;
      } = await _adapter.sendTransactions({
        transactions: [jsonTransaction],
        callbackUrl: url.toString(),
      });

      console.log("✅ Transaction Result:", result);

      if (result.url) {
        console.log("🌐 Redirecting to wallet:", result.url);
        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.href = result.url;
          }, 100);
        }
      } else if (result.outcomes && result.outcomes.length > 0) {
        result.outcomes.forEach((r) => {
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
    } catch (error) {
      console.error("❌ Error sending transaction:", error);
      updateTxHistory({
        txId,
        status: "Error",
        error: tryParseJson((error as Error).message),
        finalState: true,
      });
    }

    return txId;
  }

  let nonce: number | null = lsGet("nonce") as any;
  let lastKnownBlock: any = lsGet("block") as any;
  const toDoPromises: Record<string, Promise<any>> = {};

  console.log("🔄 Fetching Nonce and Block Info");

  if (nonce === null || nonce === undefined) {
    console.log("⏳ Fetching nonce...");
    toDoPromises.nonce = accessKey({ accountId: signerId, publicKey }).then((accessKey) => {
      if ((accessKey as any).error) {
        throw new Error(`❌ Access key error: ${(accessKey as any).error}`);
      }
      console.log("✅ Retrieved nonce:", accessKey.nonce);
      lsSet("nonce", accessKey.nonce);
      return accessKey.nonce;
    });
  }

  if (!lastKnownBlock || !lastKnownBlock.header || parseFloat(lastKnownBlock.header.timestamp_nanosec) / 1e6 + MaxBlockDelayMs < Date.now()) {
    console.log("⏳ Fetching latest block...");
    toDoPromises.block = block({ blockId: "final" }).then((b: any) => {
      const newBlock = {
        header: { prev_hash: b.header.prev_hash, timestamp_nanosec: b.header.timestamp_nanosec },
      };
      console.log("✅ Retrieved block:", newBlock);
      lsSet("block", newBlock);
      return newBlock;
    });
  }

  if (Object.keys(toDoPromises).length > 0) {
    const results = await Promise.all(Object.values(toDoPromises));
    const keys = Object.keys(toDoPromises);
    results.forEach((res, i) => {
      if (keys[i] === "nonce") nonce = res;
      else if (keys[i] === "block") lastKnownBlock = res;
    });
  }

  console.log("📝 Nonce:", nonce);
  const newNonce = (nonce ?? 0) + 1;
  console.log("🆕 New Nonce:", newNonce);
  lsSet("nonce", newNonce);

  console.log("🔍 Block Header:", lastKnownBlock.header);
  const blockHash = lastKnownBlock.header.prev_hash;

  console.log("🛠 Constructing jsonTransaction...");
  const jsonTransaction = { signerId, publicKey, nonce: newNonce, receiverId, blockHash, actions };
  console.log("✅ jsonTransaction:", jsonTransaction);

  console.log("📌 Serializing Transaction...");
  const transaction = serializeTransaction(jsonTransaction);
  console.log("✅ Serialized Transaction (Uint8Array):", transaction);
  console.log("📝 Serialized Transaction Length:", transaction.length);

  console.log("🔑 Computing Hash...");
  const txHashBytes = toBase58(sha256(transaction));
  console.log("✅ SHA256 Hash (Bytes):", txHashBytes);

  const txHash58 = toBase58(txHashBytes)
  console.log("🔡 SHA256 Hash (Base58):", txHash58);

  console.log("✍️ Signing Hash...");
  const signatureBytes = signHash(txHash58, privateKey);
  console.log("✅ Signature (Bytes):", signatureBytes);
  console.log("🔡 Signature (Base58):", toBase58(signatureBytes));

  console.log("📌 Serializing Signed Transaction...");
  const signedTransaction = serializeSignedTransaction(jsonTransaction, signatureBytes);
  console.log("✅ Serialized Signed Transaction:", signedTransaction);

  console.log("🔡 Converting Signed Transaction to Base64...");
  const signedTxBase64 = toBase64(signedTransaction);
  console.log("✅ Signed Transaction (Base64):", signedTxBase64);

  console.log("📡 Sending Transaction to RPC...");
  updateTxHistory({ status: "Pending", txId, tx: jsonTransaction, signature: signatureBytes, signedTxBase64, txHash: toBase58(txHashBytes), finalState: false });

  try {
    await sendTxToRpc(signedTxBase64, waitUntil, txId);
    console.log("✅ Transaction Successfully Sent!");
  } catch (error) {
    console.log("❌ Error Sending Transaction:", error);
  }

  return txId;
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
    gas,
    deposit,
    args,
    argsBase64,
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
