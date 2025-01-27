import {
  binary_to_base58 as toBase58,
  base58_to_binary as fromBase58,
} from "base58-js";

import { toByteArray, fromByteArray } from 'base64-js';

export { toBase58, fromBase58 };

export const keyFromString = (key) =>
  fromBase58(
    key.includes(":")
      ? (() => {
          const [curve, keyPart] = key.split(":");
          if (curve !== "ed25519") {
            throw new Error(`Unsupported curve: ${curve}`);
          }
          return keyPart;
        })()
      : key
  );

export const keyToString = (key) => `ed25519:${toBase58(key)}`;

export function toBase64(data: Uint8Array): string {
  return fromByteArray(data);
}

export function fromBase64(base64: string): Uint8Array {
  return toByteArray(base64);
}
