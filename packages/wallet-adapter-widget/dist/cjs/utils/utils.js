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

// src/utils/utils.ts
var utils_exports = {};
__export(utils_exports, {
  fromBase58: () => import_base58_js.base58_to_binary,
  fromBase64: () => fromBase64,
  keyFromString: () => keyFromString,
  keyToString: () => keyToString,
  toBase58: () => import_base58_js.binary_to_base58,
  toBase64: () => toBase64
});
module.exports = __toCommonJS(utils_exports);
var import_base58_js = require("base58-js");
var import_base64_js = require("base64-js");
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
function toBase64(data) {
  return (0, import_base64_js.fromByteArray)(data);
}
function fromBase64(base64) {
  return (0, import_base64_js.toByteArray)(base64);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fromBase58,
  fromBase64,
  keyFromString,
  keyToString,
  toBase58,
  toBase64
});
//# sourceMappingURL=utils.js.map
