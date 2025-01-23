/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */
import {
  serializeSignedTransaction,
  serializeTransaction
} from "./chunk-YKPILPMX.js";
import {
  privateKeyFromRandom,
  publicKeyFromPrivate,
  sha256,
  signHash
} from "./chunk-S5Q2EM2B.js";
import {
  canSignWithLAK,
  fromBase58,
  fromBase64,
  lsGet,
  lsSet,
  toBase58,
  toBase64,
  tryParseJson
} from "./chunk-2SCAGR3F.js";

// src/near.ts
import Big from "big.js";

// ../wallet-adapter/src/index.ts
var WalletAdapter = class _WalletAdapter {
  /** @type {HTMLIFrameElement} */
  #iframe = null;
  /** @type {string} */
  #targetOrigin;
  /** @type {string} */
  #widgetUrl;
  /** @type {Map<string, Function>} */
  #pending = /* @__PURE__ */ new Map();
  /** @type {WalletState} */
  #state;
  /** @type {Function} */
  #onStateUpdate;
  /** @type {string} */
  #callbackUrl;
  /** @type {string} */
  static defaultWidgetUrl = "https://wallet-adapter.fastnear.com";
  /**
     * @param {WalletAdapterConfig} [config]
     */
  constructor({
    widgetUrl = _WalletAdapter.defaultWidgetUrl,
    targetOrigin = "*",
    onStateUpdate,
    lastState,
    callbackUrl = window.location.href
  } = {}) {
    this.#targetOrigin = targetOrigin;
    this.#widgetUrl = widgetUrl;
    this.#onStateUpdate = onStateUpdate;
    this.#callbackUrl = callbackUrl;
    this.#state = lastState || {};
    window.addEventListener("message", this.#handleMessage.bind(this));
  }
  /**
   * Creates an iframe for wallet interaction
   * @param {string} path - Path to load in iframe
   * @returns {HTMLIFrameElement}
   */
  #createIframe(path) {
    if (this.#iframe) {
      this.#iframe.remove();
    }
    const url = new URL(path, this.#widgetUrl);
    const iframe = document.createElement("iframe");
    iframe.src = url.toString();
    iframe.allow = "usb";
    iframe.style.border = "none";
    iframe.style.zIndex = "10000";
    iframe.style.position = "fixed";
    iframe.style.display = "block";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.body.appendChild(iframe);
    this.#iframe = iframe;
    return iframe;
  }
  /**
   * Handles messages from the wallet widget
   * @param {MessageEvent} event
   */
  #handleMessage(event) {
    if (this.#targetOrigin !== "*" && event.origin !== this.#targetOrigin) {
      return;
    }
    const { id, type, action, payload } = event.data;
    if (type !== "wallet-adapter") return;
    if (action === "close") {
      this.#iframe?.remove();
      this.#iframe = null;
      return;
    }
    if (payload?.state) {
      this.#state = { ...this.#state, ...payload.state };
      this.#onStateUpdate?.(this.#state);
    }
    const resolve = this.#pending.get(id);
    if (resolve) {
      this.#pending.delete(id);
      this.#iframe?.remove();
      this.#iframe = null;
      resolve(payload);
    }
  }
  /**
   * Sends a message to the wallet widget
   * @param {string} path - Path to load in iframe
   * @param {string} method - Method to call
   * @param {Object} params - Parameters to pass
   * @returns {Promise<any>}
   */
  async #sendMessage(path, method, params) {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2);
      this.#pending.set(id, resolve);
      const iframe = this.#createIframe(path);
      iframe.onload = () => {
        iframe.contentWindow?.postMessage(
          {
            type: "wallet-adapter",
            method,
            params: {
              id,
              ...params,
              state: this.#state,
              callbackUrl: params.callbackUrl || this.#callbackUrl
            }
          },
          this.#targetOrigin
        );
      };
    });
  }
  /**
   * Get current wallet state
   * @returns {WalletState}
   */
  getState() {
    return { ...this.#state };
  }
  /**
   * Set current wallet state
   * @param state
   */
  setState(state) {
    this.#state = state;
  }
  /**
   * Sign in with a NEAR wallet
   * @param {SignInConfig} config
   * @returns {Promise<SignInResult>}
   */
  async signIn(config) {
    return this.#sendMessage("/login.html", "signIn", config);
  }
  /**
   * Send a transaction using connected wallet
   * @param {TransactionConfig} config
   * @returns {Promise<TransactionResult>}
   */
  async sendTransactions(config) {
    return this.#sendMessage("/send.html", "sendTransactions", config);
  }
  /**
   * Clean up adapter resources
   */
  destroy() {
    window.removeEventListener("message", this.#handleMessage);
    this.#iframe?.remove();
    this.#iframe = null;
  }
};

// src/near.ts
Big.DP = 27;
var MaxBlockDelayMs = 1e3 * 60 * 60 * 6;
var WIDGET_URL = "http://localhost:3000/";
var DEFAULT_NETWORK_ID = "mainnet";
var NETWORKS = {
  testnet: {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.fastnear.com/"
  },
  mainnet: {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.fastnear.com/"
  }
};
var _config = lsGet("config") || { ...NETWORKS[DEFAULT_NETWORK_ID] };
var _state = lsGet("state") || {};
try {
  _state.publicKey = _state.privateKey ? publicKeyFromPrivate(_state.privateKey) : null;
} catch (e) {
  console.error("Error parsing private key:", e);
  _state.privateKey = null;
  lsSet("nonce", null);
}
var _txHistory = lsGet("txHistory") || {};
var _eventListeners = {
  account: /* @__PURE__ */ new Set(),
  tx: /* @__PURE__ */ new Set()
};
var _unbroadcastedEvents = {
  account: [],
  tx: []
};
function getWalletAdapterState() {
  return {
    publicKey: _state.publicKey,
    accountId: _state.accountId,
    lastWalletId: _state.lastWalletId,
    networkId: DEFAULT_NETWORK_ID
  };
}
var _adapter;
function updateState(newState) {
  const oldState = _state;
  _state = { ..._state, ...newState };
  lsSet("state", {
    accountId: _state.accountId,
    privateKey: _state.privateKey,
    lastWalletId: _state.lastWalletId,
    accessKeyContractId: _state.accessKeyContractId
  });
  if (newState.hasOwnProperty("privateKey") && newState.privateKey !== oldState.privateKey) {
    _state.publicKey = newState.privateKey ? publicKeyFromPrivate(newState.privateKey) : null;
    lsSet("nonce", null);
  }
  if (newState.accountId !== oldState.accountId) {
    notifyAccountListeners(newState.accountId);
  }
  if (newState.hasOwnProperty("lastWalletId") && newState.lastWalletId !== oldState.lastWalletId || newState.hasOwnProperty("accountId") && newState.accountId !== oldState.accountId || newState.hasOwnProperty("privateKey") && newState.privateKey !== oldState.privateKey) {
    _adapter.setState(getWalletAdapterState());
  }
}
function updateTxHistory(txStatus) {
  const txId = txStatus.txId;
  _txHistory[txId] = {
    ..._txHistory[txId] ?? {},
    ...txStatus,
    updateTimestamp: Date.now()
  };
  lsSet("txHistory", _txHistory);
  notifyTxListeners(_txHistory[txId]);
}
function onAdapterStateUpdate(state) {
  console.log("Adapter state update:", state);
  const { accountId, lastWalletId, privateKey } = state;
  updateState({
    accountId,
    lastWalletId,
    ...privateKey && { privateKey }
  });
}
_adapter = new WalletAdapter({
  onStateUpdate: onAdapterStateUpdate,
  lastState: getWalletAdapterState(),
  widgetUrl: WIDGET_URL
});
function parseJsonFromBytes(bytes) {
  try {
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)));
  } catch (e) {
    try {
      return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    } catch (e2) {
      return bytes;
    }
  }
}
function withBlockId(params, blockId) {
  return blockId === "final" || blockId === "optimistic" ? { ...params, finality: blockId } : !!blockId ? { ...params, block_id: blockId } : { ...params, finality: "optimistic" };
}
async function queryRpc(method, params) {
  const response = await fetch(_config.nodeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `fastnear-${Date.now()}`,
      method,
      params
    })
  });
  const result = await response.json();
  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }
  return result.result;
}
function afterTxSent(txId) {
  queryRpc("tx", {
    tx_hash: _txHistory[txId].txHash,
    sender_account_id: _txHistory[txId].tx.signerId,
    wait_until: "EXECUTED_OPTIMISTIC"
  }).then((result) => {
    const successValue = result?.status?.SuccessValue;
    updateTxHistory({
      txId,
      status: "Executed",
      result,
      successValue: successValue ? tryParseJson(fromBase64(successValue)) : void 0,
      finalState: true
    });
  }).catch((error) => {
    updateTxHistory({
      txId,
      status: "ErrorAfterIncluded",
      error: tryParseJson(error.message),
      finalState: true
    });
  });
}
function sendTxToRpc(signedTxBase64, waitUntil, txId) {
  queryRpc("send_tx", {
    signed_tx_base64: signedTxBase64,
    wait_until: waitUntil ?? "INCLUDED"
  }).then((result) => {
    console.log("Transaction included:", result);
    updateTxHistory({
      txId,
      status: "Included",
      finalState: false
    });
    afterTxSent(txId);
  }).catch((error) => {
    updateTxHistory({
      txId,
      status: "Error",
      error: tryParseJson(error.message),
      finalState: false
    });
  });
}
function notifyAccountListeners(accountId) {
  if (_eventListeners.account.size === 0) {
    _unbroadcastedEvents.account.push(accountId);
    return;
  }
  _eventListeners.account.forEach((callback) => {
    try {
      callback(accountId);
    } catch (e) {
      console.error(e);
    }
  });
}
function notifyTxListeners(tx) {
  if (_eventListeners.tx.size === 0) {
    _unbroadcastedEvents.tx.push(tx);
    return;
  }
  _eventListeners.tx.forEach((callback) => {
    try {
      callback(tx);
    } catch (e) {
      console.error(e);
    }
  });
}
function convertUnit(s, ...args) {
  if (Array.isArray(s)) {
    s = s.reduce((acc, part, i) => {
      return acc + (args[i - 1] ?? "") + part;
    });
  }
  if (typeof s == "string") {
    let match = s.match(/([0-9.,_]+)\s*([a-zA-Z]+)?/);
    if (match) {
      let amount = match[1].replace(/[_,]/g, "");
      let unitPart = match[2];
      if (unitPart) {
        switch (unitPart.toLowerCase()) {
          case "near":
            return Big(amount).mul(Big(10).pow(24)).toFixed(0);
          case "tgas":
            return Big(amount).mul(Big(10).pow(12)).toFixed(0);
          case "ggas":
            return Big(amount).mul(Big(10).pow(9)).toFixed(0);
          case "gas":
            return Big(amount).toFixed(0);
          default:
            throw new Error(`Unknown unit: ${unit}`);
        }
      } else {
        return Big(amount).toFixed(0);
      }
    }
  }
  return Big(s).toFixed(0);
}
var api = {
  // Context
  get accountId() {
    return _state.accountId;
  },
  get publicKey() {
    return _state.publicKey;
  },
  config(newConfig) {
    if (newConfig) {
      if (newConfig.networkId && _config.networkId !== newConfig.networkId) {
        _config = { ...NETWORKS[newConfig.networkId] };
        updateState({
          accountId: null,
          privateKey: null,
          lastWalletId: null
        });
        lsSet("block", null);
        _txHistory = {};
        lsSet("txHistory", _txHistory);
      }
      _config = { ..._config, ...newConfig };
      lsSet("config", _config);
    }
    return _config;
  },
  get authStatus() {
    if (!_state.accountId) {
      return "SignedOut";
    }
    const accessKey = _state.publicKey;
    const contractId = _state.accessKeyContractId;
    if (accessKey && contractId && _state.privateKey) {
      return {
        type: "SignedInWithLimitedAccessKey",
        accessKey,
        contractId
      };
    }
    return "SignedIn";
  },
  // Query Methods
  async view({ contractId, methodName, args, argsBase64, blockId }) {
    const encodedArgs = argsBase64 || (args ? toBase64(JSON.stringify(args)) : "");
    const result = await queryRpc(
      "query",
      withBlockId(
        {
          request_type: "call_function",
          account_id: contractId,
          method_name: methodName,
          args_base64: encodedArgs
        },
        blockId
      )
    );
    return parseJsonFromBytes(result.result);
  },
  async account({ accountId, blockId }) {
    return queryRpc(
      "query",
      withBlockId(
        {
          request_type: "view_account",
          account_id: accountId
        },
        blockId
      )
    );
  },
  async block({ blockId }) {
    return queryRpc("block", withBlockId({}, blockId));
  },
  async accessKey({ accountId, publicKey, blockId }) {
    return queryRpc(
      "query",
      withBlockId(
        {
          request_type: "view_access_key",
          account_id: accountId,
          public_key: publicKey
        },
        blockId
      )
    );
  },
  async tx({ txHash, accountId }) {
    return queryRpc("tx", [txHash, accountId]);
  },
  localTxHistory() {
    return [..._txHistory];
  },
  // Transaction Methods
  async sendTx({ receiverId, actions, waitUntil }) {
    const signerId = _state.accountId;
    if (!signerId) {
      throw new Error("Not signed in");
    }
    const publicKey = _state.publicKey;
    const privateKey = _state.privateKey;
    const txId = `tx-${Date.now()}-${Math.random()}`;
    if (!privateKey || receiverId !== _state.accessKeyContractId || !canSignWithLAK(actions)) {
      const jsonTransaction2 = {
        signerId,
        receiverId,
        actions
      };
      updateTxHistory({
        status: "Pending",
        txId,
        tx: jsonTransaction2,
        finalState: false
      });
      const url = new URL(window.location.href);
      url.searchParams.set("txIds", txId);
      _adapter.sendTransactions({
        transactions: [jsonTransaction2],
        callbackUrl: url.toString()
      }).then((result) => {
        console.log("Transaction result:", result);
        if (result.url) {
          console.log("Redirecting to wallet:", result.url);
          setTimeout(() => {
            window.location.href = result.url;
          }, 100);
        } else if (result.outcomes) {
          result.outcomes.forEach((result2) => {
            updateTxHistory({
              txId,
              status: "Executed",
              result: result2,
              txHash: result2.transaction.hash,
              finalState: true
            });
          });
        } else if (result.rejected) {
          updateTxHistory({
            txId,
            status: "RejectedByUser",
            finalState: true
          });
        } else if (result.error) {
          updateTxHistory({
            txId,
            status: "Error",
            error: tryParseJson(result.error),
            finalState: true
          });
        }
      }).catch((error) => {
        updateTxHistory({
          txId,
          status: "Error",
          error: tryParseJson(error.message),
          finalState: true
        });
      });
      return txId;
    }
    const toDoPromises = {};
    let nonce = lsGet("nonce");
    if (nonce === null || nonce === void 0) {
      toDoPromises.nonce = this.accessKey({
        accountId: signerId,
        publicKey
      }).then((accessKey) => {
        if (accessKey.error) {
          throw new Error(`Access key error: ${accessKey.error}`);
        }
        lsSet("nonce", accessKey.nonce);
        return accessKey.nonce;
      });
    }
    let block = lsGet("block");
    if (!block || parseFloat(block.header.timestamp_nanosec) / 1e6 + MaxBlockDelayMs < Date.now()) {
      toDoPromises.block = this.block({ blockId: "final" }).then((block2) => {
        block2 = {
          header: {
            prev_hash: block2.header.prev_hash,
            timestamp_nanosec: block2.header.timestamp_nanosec
          }
        };
        lsSet("block", block2);
        return block2;
      });
    }
    if (Object.keys(toDoPromises).length > 0) {
      let results = await Promise.all(Object.values(toDoPromises));
      for (let i = 0; i < results.length; i++) {
        if (Object.keys(toDoPromises)[i] === "nonce") {
          nonce = results[i];
        } else if (Object.keys(toDoPromises)[i] === "block") {
          block = results[i];
        }
      }
    }
    const newNonce = nonce + 1;
    lsSet("nonce", newNonce);
    const blockHash = block.header.prev_hash;
    const jsonTransaction = {
      signerId,
      publicKey,
      nonce: newNonce,
      receiverId,
      blockHash,
      actions
    };
    console.log("Transaction:", jsonTransaction);
    const transaction = serializeTransaction(jsonTransaction);
    const txHash = toBase58(sha256(transaction));
    const signature = signHash(txHash, privateKey);
    const singedTransaction = serializeSignedTransaction(
      jsonTransaction,
      signature
    );
    const signedTxBase64 = toBase64(singedTransaction);
    updateTxHistory({
      status: "Pending",
      txId,
      tx: jsonTransaction,
      signature,
      signedTxBase64,
      txHash,
      finalState: false
    });
    sendTxToRpc(signedTxBase64, waitUntil, txId);
    return txId;
  },
  // Authentication Methods
  async requestSignIn({ contractId }) {
    const privateKey = privateKeyFromRandom();
    updateState({
      accessKeyContractId: contractId,
      accountId: null,
      privateKey
    });
    const publicKey = publicKeyFromPrivate(privateKey);
    const result = await _adapter.signIn({
      networkId: _config.networkId,
      contractId,
      publicKey
    });
    console.log("Sign in result:", result);
    if (result.error) {
      throw new Error(`Wallet error: ${result.error}`);
    }
    if (result.url) {
      console.log("Redirecting to wallet:", result.url);
      setTimeout(() => {
        window.location.href = result.url;
      }, 100);
    } else if (result.accountId) {
      updateState({
        accountId: result.accountId
      });
    }
  },
  signOut() {
    updateState({
      accountId: null,
      privateKey: null,
      contractId: null
    });
  },
  // Event Handlers
  onAccount(callback) {
    _eventListeners.account.add(callback);
    if (_unbroadcastedEvents.account.length > 0) {
      const events = _unbroadcastedEvents.account;
      _unbroadcastedEvents.account = [];
      events.forEach(notifyAccountListeners);
    }
  },
  onTx(callback) {
    _eventListeners.tx.add(callback);
    if (_unbroadcastedEvents.tx.length > 0) {
      const events = _unbroadcastedEvents.tx;
      _unbroadcastedEvents.tx = [];
      events.forEach(notifyTxListeners);
    }
  },
  // Action Helpers
  actions: {
    functionCall: ({ methodName, gas, deposit, args, argsBase64 }) => ({
      type: "FunctionCall",
      methodName,
      args,
      argsBase64,
      gas,
      deposit
    }),
    transfer: (yoctoAmount) => ({
      type: "Transfer",
      deposit: yoctoAmount
    }),
    stakeNEAR: ({ amount, publicKey }) => ({
      type: "Stake",
      stake: amount,
      publicKey
    }),
    addFullAccessKey: ({ publicKey }) => ({
      type: "AddKey",
      publicKey,
      accessKey: { permission: "FullAccess" }
    }),
    addLimitedAccessKey: ({
      publicKey,
      allowance,
      accountId,
      methodNames
    }) => ({
      type: "AddKey",
      publicKey,
      accessKey: {
        permission: "FunctionCall",
        allowance,
        receiverId: accountId,
        methodNames
      }
    }),
    deleteKey: ({ publicKey }) => ({
      type: "DeleteKey",
      publicKey
    }),
    deleteAccount: ({ beneficiaryId }) => ({
      type: "DeleteAccount",
      beneficiaryId
    }),
    createAccount: () => ({
      type: "CreateAccount"
    }),
    deployContract: ({ codeBase64 }) => ({
      type: "DeployContract",
      codeBase64
    })
  },
  utils: {
    toBase64,
    fromBase64,
    toBase58,
    fromBase58
  }
};
try {
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
        accountId
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
          finalState: true
        });
      });
    } else if (txIdsArray.length === txHashes.length) {
      txIdsArray.forEach((txId, i) => {
        updateTxHistory({
          txId,
          status: "PendingGotTxHash",
          txHash: txHashes[i],
          finalState: false
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
  url.searchParams.delete("account_id");
  url.searchParams.delete("public_key");
  url.searchParams.delete("errorCode");
  url.searchParams.delete("errorMessage");
  url.searchParams.delete("all_keys");
  url.searchParams.delete("transactionHashes");
  url.searchParams.delete("txIds");
  window.history.replaceState({}, "", url.toString());
} catch (e) {
  console.error("Error handling wallet redirect:", e);
}

export {
  parseJsonFromBytes,
  convertUnit,
  api
};
//# sourceMappingURL=chunk-B2HMQPYI.js.map
