/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */

// src/utils.ts
import {
  binary_to_base58 as toBase58,
  base58_to_binary as fromBase58
} from "base58-js";
import Big from "big.js";
import { encode, decode } from "js-base64";
var LsPrefix = "__fastnear_";
function toBase64(data) {
  if (typeof data === "string") {
    return encode(data);
  } else {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const str = String.fromCharCode(...bytes);
    return encode(str);
  }
}
function fromBase64(str) {
  const binaryString = decode(str);
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
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
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
  return actions.length === 1 && actions[0].type === "FunctionCall" && Big(actions[0]?.deposit ?? "0").eq(0);
}

export {
  toBase58,
  fromBase58,
  toBase64,
  fromBase64,
  lsSet,
  lsGet,
  deepCopy,
  tryParseJson,
  canSignWithLAK
};
//# sourceMappingURL=chunk-2SCAGR3F.js.map
