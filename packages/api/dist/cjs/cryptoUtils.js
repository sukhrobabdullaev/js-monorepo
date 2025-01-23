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

// src/cryptoUtils.ts
var cryptoUtils_exports = {};
__export(cryptoUtils_exports, {
  keyFromString: () => keyFromString,
  keyToString: () => keyToString,
  privateKeyFromRandom: () => privateKeyFromRandom,
  publicKeyFromPrivate: () => publicKeyFromPrivate,
  sha256: () => import_sha2.sha256,
  signBytes: () => signBytes,
  signHash: () => signHash
});
module.exports = __toCommonJS(cryptoUtils_exports);
var import_ed25519 = require("@noble/curves/ed25519");
var import_sha2 = require("@noble/hashes/sha2");

// src/utils.ts
var import_base58_js = require("base58-js");
var import_big = __toESM(require("big.js"), 1);
var import_js_base64 = require("js-base64");

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
function signBytes(bytes, privateKey) {
  const hash = (0, import_sha2.sha256)(bytes);
  return signHash((0, import_base58_js.binary_to_base58)(hash), privateKey);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  keyFromString,
  keyToString,
  privateKeyFromRandom,
  publicKeyFromPrivate,
  sha256,
  signBytes,
  signHash
});
//# sourceMappingURL=cryptoUtils.js.map
