import { convertUnit } from "@fastnear/utils";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.$$ = convertUnit;
}

export * from "./near.js";
