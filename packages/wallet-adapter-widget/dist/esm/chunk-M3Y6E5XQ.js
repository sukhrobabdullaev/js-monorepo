/* ⋈ 🏃🏻💨 FastNEAR Wallet Adapter Widget - https://github.com/fastnear */
import {
  mapActionForWalletSelector
} from "./chunk-BKHU7CHG.js";

// src/adapters/here.ts
import { HereWallet } from "@here-wallet/core";
function createHereAdapter() {
  return {
    async signIn({ networkId, contractId, publicKey }) {
      const here = await HereWallet.connect({ networkId });
      const accountId = await here.signIn({ contractId });
      const key = await here.authStorage.getKey(networkId, accountId);
      return {
        state: {
          accountId,
          privateKey: key.toString(),
          networkId
        }
      };
    },
    async sendTransactions({ state, transactions }) {
      if (!state?.accountId) {
        throw new Error("Not signed in");
      }
      const wallet = await HereWallet.connect({ networkId: state?.networkId });
      try {
        const response = await wallet.signAndSendTransactions({
          transactions: transactions.map(
            ({ signerId, receiverId, actions }) => {
              if (signerId && signerId !== state.accountId) {
                throw new Error("Invalid signer");
              }
              return {
                signerId: state.accountId,
                receiverId,
                actions: actions.map(mapActionForWalletSelector)
              };
            }
          )
        });
        return { outcomes: response };
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  };
}

export {
  createHereAdapter
};
//# sourceMappingURL=chunk-M3Y6E5XQ.js.map
