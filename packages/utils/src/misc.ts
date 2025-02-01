import {
  binary_to_base58 as toBase58,
  base58_to_binary as fromBase58,
} from "base58-js";
import Big from "big.js";
import { encode, decode } from 'js-base64';

export { toBase58, fromBase58 };

const LsPrefix = "__fastnear_";

export function toBase64(data) {
  if (typeof data === 'string') {
    return encode(data);
  } else {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const str = String.fromCharCode(...bytes);
    return encode(str);
  }
}

export function fromBase64(str) {
  const binaryString = decode(str);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function convertUnit(s: string | TemplateStringsArray, ...args: any[]): string {
  // Reconstruct raw string from template literal
  if (Array.isArray(s)) {
    s = s.reduce((acc, part, i) => {
      return acc + (args[i - 1] ?? "") + part;
    });
  }
  // Convert from `100 NEAR` into yoctoNear
  if (typeof s == "string") {
    const match = s.match(/([0-9.,_]+)\s*([a-zA-Z]+)?/);
    if (match) {
      const amount = match[1].replace(/[_,]/g, "");
      const unitPart = match[2];
      if (unitPart) {
        switch (unitPart.toLowerCase()) {
          case "near":
            return Big(amount).mul(Big(10).pow(24)).toFixed(0);
          case "tgas":
            return Big(amount).mul(Big(10).pow(12)).toFixed(0);
          case "ggas":
            return Big(amount).mul(Big(10).pow(9)).toFixed(0);
          case "gas":
          case "yoctonear":
            return Big(amount).toFixed(0);
          default:
            throw new Error(`Unknown unit: ${unitPart}`);
        }
      } else {
        return Big(amount).toFixed(0);
      }
    }
  }
  return Big(s).toFixed(0);
}

export function lsSet(key, value) {
  if (value === null || value === undefined) {
    localStorage.removeItem(LsPrefix + key);
  } else {
    localStorage.setItem(LsPrefix + key, JSON.stringify(value));
  }
}

export function lsGet(key) {
  const value = localStorage.getItem(LsPrefix + key);
  return tryParseJson(value, null);
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function tryParseJson(...args) {
  try {
    return JSON.parse(args[0]);
  } catch {
    if (args.length > 1) {
      return args[1];
    }
    return args[0];
  }
}

export function parseJsonFromBytes(bytes: Uint8Array) {
  try {
    const decoder = new TextDecoder();
    return JSON.parse(
      decoder.decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    );
  } catch (e) {
    try {
      return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    } catch (e) {
      return bytes;
    }
  }
}

export function canSignWithLAK(actions) {
  return (
    actions.length === 1 &&
    actions[0].type === "FunctionCall" &&
    Big(actions[0]?.deposit ?? "0").eq(0)
  );
}
