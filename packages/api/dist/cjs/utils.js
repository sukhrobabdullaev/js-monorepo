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

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  canSignWithLAK: () => canSignWithLAK,
  deepCopy: () => deepCopy,
  fromBase58: () => import_base58_js.base58_to_binary,
  fromBase64: () => fromBase64,
  lsGet: () => lsGet,
  lsSet: () => lsSet,
  toBase58: () => import_base58_js.binary_to_base58,
  toBase64: () => toBase64,
  tryParseJson: () => tryParseJson
});
module.exports = __toCommonJS(utils_exports);
var import_base58_js = require("base58-js");
var import_big = __toESM(require("big.js"), 1);
var import_js_base64 = require("js-base64");
var LsPrefix = "__fastnear_";
function toBase64(data) {
  if (typeof data === "string") {
    return (0, import_js_base64.encode)(data);
  } else {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const str = String.fromCharCode(...bytes);
    return (0, import_js_base64.encode)(str);
  }
}
function fromBase64(str) {
  const binaryString = (0, import_js_base64.decode)(str);
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
  return actions.length === 1 && actions[0].type === "FunctionCall" && (0, import_big.default)(actions[0]?.deposit ?? "0").eq(0);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  canSignWithLAK,
  deepCopy,
  fromBase58,
  fromBase64,
  lsGet,
  lsSet,
  toBase58,
  toBase64,
  tryParseJson
});
//# sourceMappingURL=utils.js.map
