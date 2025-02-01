import { serialize as borshSerialize } from "borsh";
import { keyFromString } from "./crypto.js";
import { fromBase58, fromBase64 } from "./misc.js";
import { getBorshSchema } from "@fastnear/borsh-schema";

export function mapTransaction(jsonTransaction) {
  return {
    signerId: jsonTransaction.signerId,
    publicKey: {
      ed25519Key: {
        data: keyFromString(jsonTransaction.publicKey),
      },
    },
    nonce: BigInt(jsonTransaction.nonce),
    receiverId: jsonTransaction.receiverId,
    blockHash: fromBase58(jsonTransaction.blockHash),
    actions: jsonTransaction.actions.map(mapAction),
  };
}

export function serializeTransaction(jsonTransaction) {
  const transaction = mapTransaction(jsonTransaction);
  return borshSerialize(SCHEMA.Transaction, transaction);
}

export function serializeSignedTransaction(jsonTransaction, signature) {
  const signedTransaction = {
    transaction: mapTransaction(jsonTransaction),
    signature: {
      ed25519Signature: {
        data: fromBase58(signature),
      },
    },
  };
  return borshSerialize(SCHEMA.SignedTransaction, signedTransaction);
}

export function mapAction(action) {
  switch (action.type) {
    case "CreateAccount": {
      return {
        createAccount: {},
      };
    }
    case "DeployContract": {
      return {
        deployContract: {
          code: fromBase64(action.codeBase64),
        },
      };
    }
    case "FunctionCall": {
      return {
        functionCall: {
          methodName: action.methodName,
          args: action.argsBase64
            ? fromBase64(action.argsBase64)
            : new TextEncoder().encode(JSON.stringify(action.args)),
          gas: BigInt(action.gas),
          deposit: BigInt(action.deposit),
        },
      };
    }
    case "Transfer": {
      return {
        transfer: {
          deposit: BigInt(action.deposit),
        },
      };
    }
    case "Stake": {
      return {
        stake: {
          stake: BigInt(action.stake),
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey),
            },
          },
        },
      };
    }
    case "AddKey": {
      return {
        addKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey),
            },
          },
          accessKey: {
            nonce: BigInt(action.accessKey.nonce),
            permission:
              action.accessKey.permission === "FullAccess"
                ? { fullAccess: {} }
                : {
                    functionCall: {
                      allowance: action.accessKey.allowance
                        ? BigInt(action.accessKey.allowance)
                        : null,
                      receiverId: action.accessKey.receiverId,
                      methodNames: action.accessKey.methodNames,
                    },
                  },
          },
        },
      };
    }
    case "DeleteKey": {
      return {
        deleteKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(action.publicKey),
            },
          },
        },
      };
    }
    case "DeleteAccount": {
      return {
        deleteAccount: {
          beneficiaryId: action.beneficiaryId,
        },
      };
    }
    case "SignedDelegate": {
      return {
        signedDelegate: {
          delegateAction: mapAction(action.delegateAction),
          signature: {
            ed25519Signature: fromBase58(action.signature),
          },
        },
      };
    }
    default: {
      throw new Error("Not implemented action: " + action.type);
    }
  }
}

export const SCHEMA = getBorshSchema;
