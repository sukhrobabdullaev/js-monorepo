/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - https://github.com/fastnear */
import {
  fromBase64
} from "./chunk-AJ4LTYAN.js";

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

export {
  mapActionForWalletSelector
};
//# sourceMappingURL=chunk-BKHU7CHG.js.map
