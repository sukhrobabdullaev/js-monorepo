import { HereWallet } from "@here-wallet/core";
import { mapActionForWalletSelector } from "../utils/actionToWalletSelector.js";

class WalletAdapterError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "WalletAdapterError";
    if (cause) {
      this.stack += `\nCaused by: ${cause instanceof Error ? cause.stack : String(cause)}`;
    }
  }
}

export function createHereAdapter(): any {
  return {
    async signIn({ networkId, contractId, publicKey }) {
      try {
        const here = await HereWallet.connect({ networkId });
        const accountId = await here.signIn({ contractId });
        const key = await here.authStorage.getKey(networkId, accountId);

        return {
          state: {
            accountId,
            privateKey: key.toString(),
            networkId,
          },
        };
      } catch (error) {
        throw new WalletAdapterError("Failed to sign in", error);
      }
    },

    async sendTransactions({ state, transactions }) {
      if (!state?.accountId) {
        throw new WalletAdapterError("Not signed in");
      }

      const wallet = await HereWallet.connect({ networkId: state?.networkId });

      try {
        const response = await wallet.signAndSendTransactions({
          transactions: transactions.map(
            ({ signerId, receiverId, actions }) => {
              if (signerId && signerId !== state.accountId) {
                throw new WalletAdapterError("Invalid signer");
              }
              return {
                signerId: state.accountId,
                receiverId,
                actions: actions.map(mapActionForWalletSelector),
              };
            }
          ),
        });

        return { outcomes: response };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === "User cancelled the action" ||
            error.message === "User closed the window before completing the action")
        ) {
          return { rejected: true };
        }
        throw new WalletAdapterError("Transaction signing failed", error);
      }
    },
  };
}
