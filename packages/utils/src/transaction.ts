import { serialize as borshSerialize, deserialize as borshDeserialize, Schema } from "borsh";
import { keyFromString } from "./crypto.js";
import { fromBase58, fromBase64, toBase64 } from "./misc.js";
import { getBorshSchema } from "@fastnear/borsh-schema";

export interface PlainTransaction {
  signerId: string;
  publicKey: string;
  nonce: string | bigint | number;
  receiverId: string;
  blockHash: string;
  actions: Array<any>;
}

export interface PlainSignedTransaction {
  transaction: object;
  signature: object;
}

// Function to return a JSON-ready version of the transaction
export const txToJson = (tx: PlainTransaction): Record<string, any> => {
  return JSON.parse(JSON.stringify(tx, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

// dude let's make this better. head just couldn't find a good name
export const txToJsonStringified = (tx: PlainTransaction): string => {
  return JSON.stringify(txToJson(tx));
}

export function mapTransaction(jsonTransaction: PlainTransaction) {
  return {
    signerId: jsonTransaction.signerId,
    publicKey: {
      ed25519Key: {
        data: keyFromString(jsonTransaction.publicKey)
      }
    },
    nonce: BigInt(jsonTransaction.nonce),
    receiverId: jsonTransaction.receiverId,
    blockHash: fromBase58(jsonTransaction.blockHash),
    actions: jsonTransaction.actions.map(mapAction)
  };
}

export function serializeTransaction(jsonTransaction: PlainTransaction) {
  console.log("fastnear: serializing transaction");

  const transaction = mapTransaction(jsonTransaction);
  console.log("fastnear: mapped transaction for borsh:", transaction);

  return borshSerialize(SCHEMA.Transaction, transaction);
}

export function serializeSignedTransaction(jsonTransaction: PlainTransaction, signature) {
  console.log("fastnear: Serializing Signed Transaction", jsonTransaction);
  console.log('fastnear: signature', signature)
  console.log('fastnear: signature length', fromBase58(signature).length)

  const mappedSignedTx = mapTransaction(jsonTransaction)
  console.log('fastnear: mapped (for borsh schema) signed transaction', mappedSignedTx)

  const plainSignedTransaction: PlainSignedTransaction = {
    transaction: mappedSignedTx,
    signature: {
      ed25519Signature: {
        data: fromBase58(signature),
      },
    },
  };

  const borshSignedTx = borshSerialize(SCHEMA.SignedTransaction, plainSignedTransaction, true);
  console.log('fastnear: borsh-serialized signed transaction:', borshSignedTx);

  return borshSignedTx;
}

export function mapAction(action: any): object {
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
      // turn JS object into json string
      const argsAsString = JSON.stringify(action.args)
      // an alternative to using NodeJS Buffer, TextEncoder can help but is limited
      const argsEncoded = new TextEncoder().encode(argsAsString)

      return {
        functionCall: {
          methodName: action.methodName,
          args: argsEncoded,
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

export const SCHEMA = getBorshSchema();
