/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - https://github.com/fastnear */

// src/utils/utils.ts
import {
  binary_to_base58 as toBase58,
  base58_to_binary as fromBase58
} from "base58-js";
import { toByteArray, fromByteArray } from "base64-js";
var keyFromString = (key) => fromBase58(
  key.includes(":") ? (() => {
    const [curve, keyPart] = key.split(":");
    if (curve !== "ed25519") {
      throw new Error(`Unsupported curve: ${curve}`);
    }
    return keyPart;
  })() : key
);
var keyToString = (key) => `ed25519:${toBase58(key)}`;
function toBase64(data) {
  return fromByteArray(data);
}
function fromBase64(base64) {
  return toByteArray(base64);
}

export {
  toBase58,
  fromBase58,
  keyFromString,
  keyToString,
  toBase64,
  fromBase64
};
//# sourceMappingURL=chunk-AJ4LTYAN.js.map
