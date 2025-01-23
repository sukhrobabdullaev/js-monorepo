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

// src/transaction.ts
var transaction_exports = {};
__export(transaction_exports, {
  SCHEMA: () => SCHEMA,
  mapAction: () => mapAction,
  serializeSignedTransaction: () => serializeSignedTransaction,
  serializeTransaction: () => serializeTransaction
});
module.exports = __toCommonJS(transaction_exports);
var import_borsh = require("borsh");

// src/cryptoUtils.ts
var import_ed25519 = require("@noble/curves/ed25519");
var import_sha2 = require("@noble/hashes/sha2");

// src/utils.ts
var import_base58_js = require("base58-js");
var import_big = __toESM(require("big.js"), 1);
var import_js_base64 = require("js-base64");
function fromBase64(str) {
  const binaryString = (0, import_js_base64.decode)(str);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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

// src/transaction.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SCHEMA,
  mapAction,
  serializeSignedTransaction,
  serializeTransaction
});
//# sourceMappingURL=transaction.js.map
