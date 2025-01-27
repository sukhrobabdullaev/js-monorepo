/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - https://github.com/fastnear */
import {
  createNearAdapter
} from "./chunk-FRJGXRW7.js";
import {
  createMeteorAdapter
} from "./chunk-VKAP6ZH2.js";
import {
  createHereAdapter
} from "./chunk-M3Y6E5XQ.js";
import {
  near_default
} from "./chunk-NQRLIIBW.js";
import {
  meteor_default
} from "./chunk-AY5XE6ZG.js";
import {
  here_default
} from "./chunk-5YON4ULE.js";

// src/wallets.ts
var wallets = [
  {
    id: "near",
    name: "NEAR Wallet",
    icon: near_default,
    adapter: createNearAdapter()
  },
  {
    id: "here",
    name: "HERE Wallet",
    icon: here_default,
    adapter: createHereAdapter()
  },
  {
    id: "meteor",
    name: "Meteor Wallet",
    icon: meteor_default,
    adapter: createMeteorAdapter()
  }
];

export {
  wallets
};
//# sourceMappingURL=chunk-MQQSILKV.js.map
