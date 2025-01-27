/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - https://github.com/fastnear */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/adapters/meteor.ts
var meteor_exports = {};
__export(meteor_exports, {
  createMeteorAdapter: () => createMeteorAdapter
});
module.exports = __toCommonJS(meteor_exports);
var import_meer_api_js = require("meer-api-js");
var import_meteorwallet_sdk = require("@fastnear/meteorwallet-sdk");

// src/utils/utils.ts
var import_base58_js = require("base58-js");
var import_base64_js = require("base64-js");
function fromBase64(base64) {
  return (0, import_base64_js.toByteArray)(base64);
}

// src/utils/actionToWalletSelector.ts
var mapActionForWalletSelector = (action) => {
  const type = action.type;
  switch (type) {
    case "CreateAccount":
      return action;
    case "DeployContract": {
      return { type, params: { code: fromBase64(action.codeBase64) } };
    }
    case "FunctionCall": {
      return {
        type,
        params: {
          methodName: action.methodName,
          args: action.argsBase64 ? fromBase64(action.argsBase64) : action.args,
          gas: action.gas,
          deposit: action.deposit
        }
      };
    }
    case "Transfer": {
      return { type, params: { deposit: action.deposit } };
    }
    case "Stake": {
      return {
        type,
        params: { stake: action.stake, publicKey: action.publicKey }
      };
    }
    case "AddKey": {
      return {
        type,
        params: {
          publicKey: action.publicKey,
          accessKey: action.accessKey
        }
      };
    }
    case "DeleteKey": {
      return { type, params: { publicKey: action.publicKey } };
    }
    case "DeleteAccount": {
      return { type, params: { beneficiaryId: action.beneficiaryId } };
    }
    default:
      throw new Error("Invalid action type");
  }
};

// src/adapters/meteor.ts
var import_crypto = require("@near-js/crypto");
var import_meer_api_js2 = require("meer-api-js");
async function createMeteorWalletInstance({ networkId = "mainnet" }) {
  const keyStore = new import_meer_api_js2.keyStores.BrowserLocalStorageKeyStore(
    window.localStorage,
    "_meteor_wallet"
  );
  const near = await (0, import_meer_api_js.connect)({
    keyStore,
    networkId,
    nodeUrl: networkId === "mainnet" ? "https://rpc.mainnet.near.org" : "https://rpc.testnet.near.org"
  });
  return new import_meteorwallet_sdk.MeteorWallet({ near, appKeyPrefix: "near_app" });
}
function createMeteorAdapter() {
  return {
    async signIn({ networkId, contractId, publicKey }) {
      publicKey = import_crypto.PublicKey.from(publicKey);
      console.log("aloha publicKey", publicKey);
      const keyPair = import_meer_api_js.KeyPair.fromString(publicKey.toString());
      console.log("aloha keyPair", keyPair);
      const wallet = await createMeteorWalletInstance({ networkId });
      const {
        success,
        payload: { accountId }
      } = await wallet.requestSignIn({
        contract_id: contractId,
        type: import_meteorwallet_sdk.EMeteorWalletSignInType.ALL_METHODS,
        keyPair
      });
      if (!success) {
        throw new Error("Meteor Wallet sign in failed");
      }
      return {
        state: {
          accountId,
          publicKey: publicKey.toString(),
          networkId
        }
      };
    },
    async sendTransactions({ state, transactions }) {
      if (!state?.accountId) {
        throw new Error("Not signed in");
      }
      const wallet = await createMeteorWalletInstance({
        networkId: state?.networkId
      });
      try {
        const response = await wallet.requestSignTransactions({
          transactions: transactions.map(
            ({ signerId, receiverId, actions }) => {
              if (signerId && signerId !== state.accountId) {
                throw new Error("Invalid signer");
              }
              return {
                signerId: state.accountId,
                receiverId,
                actions: actions.map(mapActionForWalletSelector)
              };
            }
          )
        });
        return { outcomes: response };
      } catch (error) {
        if (error.message === "User cancelled the action" || error.message === "User closed the window before completing the action") {
          return { rejected: true };
        }
        console.log(error);
        throw new Error(error);
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMeteorAdapter
});
//# sourceMappingURL=meteor.js.map
