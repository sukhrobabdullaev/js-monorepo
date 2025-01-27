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

// src/utils/actionToWalletSelector.ts
var actionToWalletSelector_exports = {};
__export(actionToWalletSelector_exports, {
  mapActionForWalletSelector: () => mapActionForWalletSelector
});
module.exports = __toCommonJS(actionToWalletSelector_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapActionForWalletSelector
});
//# sourceMappingURL=actionToWalletSelector.js.map
