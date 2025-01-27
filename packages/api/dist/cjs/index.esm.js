/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.esm.ts
var index_esm_exports = {};
__export(index_esm_exports, {
  $$: () => convertUnit,
  near: () => api
});
module.exports = __toCommonJS(index_esm_exports);

// src/near.ts
var import_big2 = __toESM(require("big.js"), 1);

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

// src/cryptoUtils.ts
var import_ed25519 = require("@noble/curves/ed25519");
var import_sha2 = require("@noble/hashes/sha2");

// src/utils.ts
var import_base58_js = require("base58-js");
var import_big = __toESM(require("big.js"), 1);
var import_js_base64 = require("js-base64");
var LsPrefix = "__fastnear_";
function toBase64(data) {
  if (typeof data === "string") {
    return (0, import_js_base64.encode)(data);
  } else {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const str = String.fromCharCode(...bytes);
    return (0, import_js_base64.encode)(str);
  }
}
function fromBase64(str) {
  const binaryString = (0, import_js_base64.decode)(str);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function lsSet(key, value) {
  if (value === null || value === void 0) {
    localStorage.removeItem(LsPrefix + key);
  } else {
    localStorage.setItem(LsPrefix + key, JSON.stringify(value));
  }
}
function lsGet(key) {
  const value = localStorage.getItem(LsPrefix + key);
  return tryParseJson(value, null);
}
function tryParseJson(...args) {
  try {
    return JSON.parse(args[0]);
  } catch {
    if (args.length > 1) {
      return args[1];
    }
    return args[0];
  }
}
function canSignWithLAK(actions) {
  return actions.length === 1 && actions[0].type === "FunctionCall" && (0, import_big.default)(actions[0]?.deposit ?? "0").eq(0);
}

// src/cryptoUtils.ts
var keyFromString = (key) => (0, import_base58_js.base58_to_binary)(
  key.includes(":") ? (() => {
    const [curve, keyPart] = key.split(":");
    if (curve !== "ed25519") {
      throw new Error(`Unsupported curve: ${curve}`);
    }
    return keyPart;
  })() : key
);
var keyToString = (key) => `ed25519:${(0, import_base58_js.binary_to_base58)(key)}`;
function publicKeyFromPrivate(privateKey) {
  privateKey = keyFromString(privateKey).slice(0, 32);
  const publicKey = import_ed25519.ed25519.getPublicKey(privateKey);
  return keyToString(publicKey);
}
function privateKeyFromRandom() {
  const privateKey = crypto.getRandomValues(new Uint8Array(64));
  return keyToString(privateKey);
}
function signHash(hash, privateKey) {
  privateKey = keyFromString(privateKey).slice(0, 32);
  const signature = import_ed25519.ed25519.sign((0, import_base58_js.base58_to_binary)(hash), privateKey);
  return (0, import_base58_js.binary_to_base58)(signature);
}

// src/transaction.ts
var import_borsh = require("borsh");
function mapTransaction(jsonTransaction) {
  return {
    signerId: jsonTransaction.signerId,
    publicKey: {
      ed25519Key: {
        data: keyFromString(jsonTransaction.publicKey)
      }
    },
    nonce: BigInt(jsonTransaction.nonce),
    receiverId: jsonTransaction.receiverId,
    blockHash: (0, import_base58_js.base58_to_binary)(jsonTransaction.blockHash),
    actions: jsonTransaction.actions.map(mapAction)
  };
}
function serializeTransaction(jsonTransaction) {
  const transaction = mapTransaction(jsonTransaction);
  return (0, import_borsh.serialize)(SCHEMA.Transaction, transaction);
}
function serializeSignedTransaction(jsonTransaction, signature) {
  const signedTransaction = {
    transaction: mapTransaction(jsonTransaction),
    signature: {
      ed25519Signature: {
        data: (0, import_base58_js.base58_to_binary)(signature)
      }
    }
  };
  return (0, import_borsh.serialize)(SCHEMA.SignedTransaction, signedTransaction);
}
function mapAction(action) {
  switch (action.type) {
    case "CreateAccount": {
      return {
        createAccount: {}
      };
    }
    case "DeployContract": {
      return {
        deployContract: {
          code: fromBase64(action.codeBase64)
        }
      };
    }
    case "FunctionCall": {
      return {
        functionCall: {
          methodName: action.methodName,
          args: action.argsBase64 ? fromBase64(action.argsBase64) : new TextEncoder().encode(JSON.stringify(action.args)),
          gas: BigInt(action.gas),
          deposit: BigInt(action.deposit)
        }
      };
    }
    case "Transfer": {
      return {
        transfer: {
          deposit: BigInt(action.deposit)
        }
      };
    }
    case "Stake": {
      return {
        stake: {
          stake: BigInt(action.stake),
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey)
            }
          }
        }
      };
    }
    case "AddKey": {
      return {
        addKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey)
            }
          },
          accessKey: {
            nonce: BigInt(action.accessKey.nonce),
            permission: action.accessKey.permission === "FullAccess" ? { fullAccess: {} } : {
              functionCall: {
                allowance: action.accessKey.allowance ? BigInt(action.accessKey.allowance) : null,
                receiverId: action.accessKey.receiverId,
                methodNames: action.accessKey.methodNames
              }
            }
          }
        }
      };
    }
    case "DeleteKey": {
      return {
        deleteKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey)
            }
          }
        }
      };
    }
    case "DeleteAccount": {
      return {
        deleteAccount: {
          beneficiaryId: action.beneficiaryId
        }
      };
    }
    case "SignedDelegate": {
      return {
        signedDelegate: {
          delegateAction: mapAction(action.delegateAction),
          signature: {
            ed25519Signature: (0, import_base58_js.base58_to_binary)(action.signature)
          }
        }
      };
    }
    default: {
      throw new Error("Not implemented action: " + action.type);
    }
  }
}
var SCHEMA = new class BorshSchema {
  Ed25519Signature = {
    struct: {
      data: { array: { type: "u8", len: 64 } }
    }
  };
  Secp256k1Signature = {
    struct: {
      data: { array: { type: "u8", len: 65 } }
    }
  };
  Signature = {
    enum: [
      { struct: { ed25519Signature: this.Ed25519Signature } },
      { struct: { secp256k1Signature: this.Secp256k1Signature } }
    ]
  };
  Ed25519Data = {
    struct: {
      data: { array: { type: "u8", len: 32 } }
    }
  };
  Secp256k1Data = {
    struct: {
      data: { array: { type: "u8", len: 64 } }
    }
  };
  PublicKey = {
    enum: [
      { struct: { ed25519Key: this.Ed25519Data } },
      { struct: { secp256k1Key: this.Secp256k1Data } }
    ]
  };
  FunctionCallPermission = {
    struct: {
      allowance: { option: "u128" },
      receiverId: "string",
      methodNames: { array: { type: "string" } }
    }
  };
  FullAccessPermission = {
    struct: {}
  };
  AccessKeyPermission = {
    enum: [
      { struct: { functionCall: this.FunctionCallPermission } },
      { struct: { fullAccess: this.FullAccessPermission } }
    ]
  };
  AccessKey = {
    struct: {
      nonce: "u64",
      permission: this.AccessKeyPermission
    }
  };
  CreateAccount = {
    struct: {}
  };
  DeployContract = {
    struct: {
      code: { array: { type: "u8" } }
    }
  };
  FunctionCall = {
    struct: {
      methodName: "string",
      args: { array: { type: "u8" } },
      gas: "u64",
      deposit: "u128"
    }
  };
  Transfer = {
    struct: {
      deposit: "u128"
    }
  };
  Stake = {
    struct: {
      stake: "u128",
      publicKey: this.PublicKey
    }
  };
  AddKey = {
    struct: {
      publicKey: this.PublicKey,
      accessKey: this.AccessKey
    }
  };
  DeleteKey = {
    struct: {
      publicKey: this.PublicKey
    }
  };
  DeleteAccount = {
    struct: {
      beneficiaryId: "string"
    }
  };
  ClassicAction = {
    enum: [
      { struct: { createAccount: this.CreateAccount } },
      { struct: { deployContract: this.DeployContract } },
      { struct: { functionCall: this.FunctionCall } },
      { struct: { transfer: this.Transfer } },
      { struct: { stake: this.Stake } },
      { struct: { addKey: this.AddKey } },
      { struct: { deleteKey: this.DeleteKey } },
      { struct: { deleteAccount: this.DeleteAccount } }
    ]
  };
  DelegateAction = {
    struct: {
      senderId: "string",
      receiverId: "string",
      actions: { array: { type: this.ClassicAction } },
      nonce: "u64",
      maxBlockHeight: "u64",
      publicKey: this.PublicKey
    }
  };
  SignedDelegate = {
    struct: {
      delegateAction: this.DelegateAction,
      signature: this.Signature
    }
  };
  Action = {
    enum: [
      { struct: { createAccount: this.CreateAccount } },
      { struct: { deployContract: this.DeployContract } },
      { struct: { functionCall: this.FunctionCall } },
      { struct: { transfer: this.Transfer } },
      { struct: { stake: this.Stake } },
      { struct: { addKey: this.AddKey } },
      { struct: { deleteKey: this.DeleteKey } },
      { struct: { deleteAccount: this.DeleteAccount } },
      { struct: { signedDelegate: this.SignedDelegate } }
    ]
  };
  Transaction = {
    struct: {
      signerId: "string",
      publicKey: this.PublicKey,
      nonce: "u64",
      receiverId: "string",
      blockHash: { array: { type: "u8", len: 32 } },
      actions: { array: { type: this.Action } }
    }
  };
  SignedTransaction = {
    struct: {
      transaction: this.Transaction,
      signature: this.Signature
    }
  };
}();

// src/near.ts
import_big2.default.DP = 27;
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
  return blockId === "final" || blockId === "optimistic" ? { ...params, finality: blockId } : blockId ? { ...params, block_id: blockId } : { ...params, finality: "optimistic" };
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
    const match = s.match(/([0-9.,_]+)\s*([a-zA-Z]+)?/);
    if (match) {
      const amount = match[1].replace(/[_,]/g, "");
      const unitPart = match[2];
      if (unitPart) {
        switch (unitPart.toLowerCase()) {
          case "near":
            return (0, import_big2.default)(amount).mul((0, import_big2.default)(10).pow(24)).toFixed(0);
          case "tgas":
            return (0, import_big2.default)(amount).mul((0, import_big2.default)(10).pow(12)).toFixed(0);
          case "ggas":
            return (0, import_big2.default)(amount).mul((0, import_big2.default)(10).pow(9)).toFixed(0);
          case "gas":
          case "yoctonear":
            return (0, import_big2.default)(amount).toFixed(0);
          default:
            throw new Error(`Unknown unit: ${unitPart}`);
        }
      } else {
        return (0, import_big2.default)(amount).toFixed(0);
      }
    }
  }
  return (0, import_big2.default)(s).toFixed(0);
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
  async view({
    contractId,
    methodName,
    args,
    argsBase64,
    blockId
  }) {
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
  async account({
    accountId,
    blockId
  }) {
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
  async accessKey({
    accountId,
    publicKey,
    blockId
  }) {
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
  async sendTx({
    receiverId,
    actions,
    waitUntil
  }) {
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
      const url = new URL(typeof window !== "undefined" ? window.location.href : "");
      url.searchParams.set("txIds", txId);
      _adapter.sendTransactions({
        transactions: [jsonTransaction2],
        callbackUrl: url.toString()
      }).then((result) => {
        console.log("Transaction result:", result);
        if (result.url) {
          console.log("Redirecting to wallet:", result.url);
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.href = result.url;
            }, 100);
          }
        } else if (result.outcomes) {
          result.outcomes.forEach((r) => {
            updateTxHistory({
              txId,
              status: "Executed",
              result: r,
              txHash: r.transaction.hash,
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
    let nonce = lsGet("nonce");
    let block = lsGet("block");
    const toDoPromises = {};
    if (nonce === null || nonce === void 0) {
      toDoPromises.nonce = api.accessKey({
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
    if (!block || !block.header || parseFloat(block.header.timestamp_nanosec) / 1e6 + MaxBlockDelayMs < Date.now()) {
      toDoPromises.block = api.block({ blockId: "final" }).then((b) => {
        const newBlock = {
          header: {
            prev_hash: b.header.prev_hash,
            timestamp_nanosec: b.header.timestamp_nanosec
          }
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
      actions
    };
    console.log("Transaction:", jsonTransaction);
    const transaction = serializeTransaction(jsonTransaction);
    const txHash = (0, import_base58_js.binary_to_base58)(import_sha2.sha256(transaction));
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
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = result.url;
        }, 100);
      }
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
    functionCall: ({
      methodName,
      gas,
      deposit,
      args,
      argsBase64
    }) => ({
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
    toBase58: import_base58_js.binary_to_base58,
    fromBase58: import_base58_js.base58_to_binary
  }
};
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
  }
} catch (e) {
  console.error("Error handling wallet redirect:", e);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $$,
  near
});
//# sourceMappingURL=index.esm.js.map
