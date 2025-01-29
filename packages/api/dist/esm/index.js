/* ⋈ 🏃🏻💨 FastNEAR API - ESM */
import { api as near, convertUnit } from "./near.js";
window.near = near;
window.$$ = convertUnit;
export * from "./cryptoUtils.js";
export * from "./near.js";
export * from "./transaction.js";
export * from "./utils.js";
export {
  near
};
//# sourceMappingURL=index.js.map