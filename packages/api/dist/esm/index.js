/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */
import {
  api,
  convertUnit,
  parseJsonFromBytes
} from "./chunk-OR3WITSY.js";
import {
  SCHEMA,
  mapAction,
  serializeSignedTransaction,
  serializeTransaction
} from "./chunk-YKPILPMX.js";
import {
  keyFromString,
  keyToString,
  privateKeyFromRandom,
  publicKeyFromPrivate,
  sha256,
  signBytes,
  signHash
} from "./chunk-S5Q2EM2B.js";
import {
  canSignWithLAK,
  deepCopy,
  fromBase58,
  fromBase64,
  lsGet,
  lsSet,
  toBase58,
  toBase64,
  tryParseJson
} from "./chunk-2SCAGR3F.js";

// src/index.ts
window.near = api;
window.$$ = convertUnit;
export {
  SCHEMA,
  api,
  canSignWithLAK,
  convertUnit,
  deepCopy,
  fromBase58,
  fromBase64,
  keyFromString,
  keyToString,
  lsGet,
  lsSet,
  mapAction,
  api as near,
  parseJsonFromBytes,
  privateKeyFromRandom,
  publicKeyFromPrivate,
  serializeSignedTransaction,
  serializeTransaction,
  sha256,
  signBytes,
  signHash,
  toBase58,
  toBase64,
  tryParseJson
};
//# sourceMappingURL=index.js.map
