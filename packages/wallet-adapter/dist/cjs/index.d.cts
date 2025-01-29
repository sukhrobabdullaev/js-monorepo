/**
 * @typedef {Object} WalletState
 * @property {string} [accountId] - NEAR account ID if signed in
 * @property {string} [publicKey] - Public key if available
 * @property {string} [privateKey] - Private key if available
 * @property {string} [lastWalletId] - ID of last used wallet
 * @property {string} [networkId] - ID of last used network
 */
/**
 * @typedef {Object} SignInConfig
 * @property {string} networkId - NEAR network ID ('mainnet' or 'testnet')
 * @property {string} contractId - Contract ID to request access for
 * @property {string} [walletId] - Preferred wallet to use. E.g. 'near', 'here', 'meteor'
 * @property {string} [callbackUrl] - URL to redirect back to after wallet interaction
 */
/**
 * @typedef {Object} SignInResult
 * @property {string} [url] - URL to redirect to if needed
 * @property {string} [accountId] - Account ID if immediately available
 * @property {string} [error] - Error message if sign in failed
 */
/**
 * @typedef {Object} Transaction
 * @property {string} [signerId] - Transaction signer account ID
 * @property {string} receiverId - Transaction receiver account ID
 * @property {Object[]} actions - Transaction actions to perform
 */
/**
 * @typedef {Object} TransactionConfig
 * @property {Transaction} transactions - Transaction actions to perform
 * @property {string} [callbackUrl] - URL to redirect back to after wallet interaction
 */
/**
 * @typedef {Object} TransactionResult
 * @property {string} [url] - URL to redirect to if needed
 * @property {string} [hash] - Transaction hash if immediately available
 * @property {string} [error] - Error message if transaction failed
 */
interface WalletAdapterConstructor {
    widgetUrl?: string;
    targetOrigin?: string;
    onStateUpdate?: (state: any) => void;
    lastState?: any;
    callbackUrl?: string;
}
/**
 * @typedef {Object} WalletAdapterConfig
 * @property {string} [widgetUrl] - URL of the wallet widget (defaults to official hosted version)
 * @property {string} [targetOrigin] - Target origin for postMessage (defaults to '*')
 * @property {string} [lastState] - The last state that was given by WalletAdapter before the redirect or reload.
 * @property {(state: WalletState) => void} [onStateUpdate] - Called when wallet state changes
 * @property {string} [callbackUrl] - Default callback URL for wallet interactions (defaults to current page URL)
 */
/**
 * Interface for interacting with NEAR wallets
 */
declare class WalletAdapter {
    #private;
    /** @type {string} */
    static defaultWidgetUrl: string;
    /**
     * @param {WalletAdapterConfig} [config]
     */
    constructor({ widgetUrl, targetOrigin, onStateUpdate, lastState, callbackUrl, }?: WalletAdapterConstructor);
    /**
     * Get current wallet state
     * @returns {WalletState}
     */
    getState(): any;
    /**
     * Set current wallet state
     * @param state
     */
    setState(state: any): void;
    /**
     * Sign in with a NEAR wallet
     * @param {SignInConfig} config
     * @returns {Promise<SignInResult>}
     */
    signIn(config: any): Promise<unknown>;
    /**
     * Send a transaction using connected wallet
     * @param {TransactionConfig} config
     * @returns {Promise<TransactionResult>}
     */
    sendTransactions(config: any): Promise<unknown>;
    /**
     * Clean up adapter resources
     */
    destroy(): void;
}

export { WalletAdapter, type WalletAdapterConstructor };
