/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */
import {
  fromBase58,
  toBase58
} from "./chunk-2SCAGR3F.js";

// src/cryptoUtils.ts
import { ed25519 } from "@noble/curves/ed25519";
import { sha256 } from "@noble/hashes/sha2";
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
function publicKeyFromPrivate(privateKey) {
  privateKey = keyFromString(privateKey).slice(0, 32);
  const publicKey = ed25519.getPublicKey(privateKey);
  return keyToString(publicKey);
}
function privateKeyFromRandom() {
  const privateKey = crypto.getRandomValues(new Uint8Array(64));
  return keyToString(privateKey);
}
function signHash(hash, privateKey) {
  privateKey = keyFromString(privateKey).slice(0, 32);
  const signature = ed25519.sign(fromBase58(hash), privateKey);
  return toBase58(signature);
}
function signBytes(bytes, privateKey) {
  const hash = sha256(bytes);
  return signHash(toBase58(hash), privateKey);
}

export {
  sha256,
  keyFromString,
  keyToString,
  publicKeyFromPrivate,
  privateKeyFromRandom,
  signHash,
  signBytes
};
//# sourceMappingURL=chunk-S5Q2EM2B.js.map
