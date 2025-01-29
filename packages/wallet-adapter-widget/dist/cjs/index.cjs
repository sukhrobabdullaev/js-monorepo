/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - CJS */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var src_exports = {};
__export(src_exports, {
  handleLogin: () => handleLogin,
  handleSend: () => handleSend
});
module.exports = __toCommonJS(src_exports);
var import_wallets = require("./wallets.js");
let params = {};
window.addEventListener("message", (event) => {
  if (event.source !== window.parent) {
    return;
  }
  if (event.data.method === "signIn") {
    params = event.data.params || {};
    handleLogin();
  } else if (event.data.method === "sendTransactions") {
    params = event.data.params || {};
    handleSend();
  }
});
async function handleLogin() {
  function setupWalletList() {
    const walletList = document.getElementById("walletList");
    walletList.innerHTML = import_wallets.wallets.map(
      (wallet) => `
      <li class="wallet-item">
        <button class="wallet-button" data-wallet-id="${wallet.id}">
          <img class="wallet-icon" src="${wallet.icon}" alt="${wallet.name} icon">
          ${wallet.name}
        </button>
      </li>
    `
    ).join("");
    walletList.addEventListener("click", handleWalletSelect);
  }
  __name(setupWalletList, "setupWalletList");
  async function handleWalletSelect(e) {
    const button = e.target.closest(".wallet-button");
    if (!button) return;
    const wallet = import_wallets.wallets.find((w) => w.id === button.dataset.walletId);
    if (!wallet) return;
    try {
      const result = await wallet.adapter.signIn(params);
      window.parent.postMessage(
        {
          type: "wallet-adapter",
          id: params.id,
          payload: {
            ...result,
            state: {
              ...result.state,
              lastWalletId: wallet.id
            }
          }
        },
        "*"
      );
    } catch (error) {
      window.parent.postMessage(
        {
          type: "wallet-adapter",
          id: params.id,
          payload: { error: error.message }
        },
        "*"
      );
    }
  }
  __name(handleWalletSelect, "handleWalletSelect");
  document.getElementById("closeButton")?.addEventListener("click", () => {
    window.parent.postMessage(
      {
        type: "wallet-adapter",
        action: "close"
      },
      "*"
    );
  });
  setupWalletList();
}
__name(handleLogin, "handleLogin");
async function handleSend() {
  const { state = {} } = params;
  const wallet = import_wallets.wallets.find((w) => w.id === state.lastWalletId);
  if (!wallet) {
    window.parent.postMessage(
      {
        type: "wallet-adapter",
        id: params.id,
        payload: { error: "No wallet selected" }
      },
      "*"
    );
    return;
  }
  if (state.lastWalletId === "meteor") {
    const sendButton = document.getElementById("sign-transaction");
    sendButton.addEventListener("click", async () => {
      try {
        const result = await wallet.adapter.sendTransactions(params);
        window.parent.postMessage(
          {
            type: "wallet-adapter",
            id: params.id,
            payload: result
          },
          "*"
        );
      } catch (error) {
        window.parent.postMessage(
          {
            type: "wallet-adapter",
            id: params.id,
            payload: { error: error.message }
          },
          "*"
        );
      }
    });
  } else {
    try {
      const result = await wallet.adapter.sendTransactions(params);
      window.parent.postMessage(
        {
          type: "wallet-adapter",
          id: params.id,
          payload: result
        },
        "*"
      );
    } catch (error) {
      window.parent.postMessage(
        {
          type: "wallet-adapter",
          id: params.id,
          payload: { error: error.message }
        },
        "*"
      );
    }
  }
}
__name(handleSend, "handleSend");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleLogin,
  handleSend
});
//# sourceMappingURL=index.cjs.map