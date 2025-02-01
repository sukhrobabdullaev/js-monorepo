import * as reExportUtils from '@fastnear/utils';
import { reExportBorshSchema } from '@fastnear/utils';

interface NetworkConfig {
    networkId: string;
    nodeUrl?: string;
    walletUrl?: string;
    helperUrl?: string;
    explorerUrl?: string;
    [key: string]: any;
}
interface TxStatus {
    txId: string;
    updateTimestamp?: number;
    [key: string]: any;
}
type TxHistory = Record<string, TxStatus>;

declare const MaxBlockDelayMs: number;
declare const WIDGET_URL = "https://wallet-adapter.fastnear.com";
declare const DEFAULT_NETWORK_ID = "mainnet";
declare const NETWORKS: {
    testnet: {
        networkId: string;
        nodeUrl: string;
    };
    mainnet: {
        networkId: string;
        nodeUrl: string;
    };
};
declare function withBlockId(params: Record<string, any>, blockId?: string): {
    finality: string;
} | {
    block_id: string;
};
declare function queryRpc(method: string, params: Record<string, any> | any[]): Promise<any>;
declare function afterTxSent(txId: string): void;
declare function sendTxToRpc(signedTxBase64: string, waitUntil: string | undefined, txId: string): void;
interface AccessKeyView {
    nonce: number;
    permission: any;
}
declare const accountId: () => string;
declare const publicKey: () => string;
declare const config: (newConfig?: Record<string, any>) => NetworkConfig;
declare const authStatus: () => string | Record<string, any>;
declare const view: ({ contractId, methodName, args, argsBase64, blockId, }: {
    contractId: string;
    methodName: string;
    args?: any;
    argsBase64?: string;
    blockId?: string;
}) => Promise<any>;
declare const account: ({ accountId, blockId, }: {
    accountId: string;
    blockId?: string;
}) => Promise<any>;
declare const block: ({ blockId }: {
    blockId?: string;
}) => Promise<any>;
declare const accessKey: ({ accountId, publicKey, blockId, }: {
    accountId: string;
    publicKey: string;
    blockId?: string;
}) => Promise<AccessKeyView>;
declare const tx: ({ txHash, accountId, }: {
    txHash: string;
    accountId: string;
}) => Promise<any>;
declare const localTxHistory: () => TxHistory;
declare const sendTx: ({ receiverId, actions, waitUntil, }: {
    receiverId: string;
    actions: any[];
    waitUntil?: string;
}) => Promise<string>;
declare const requestSignIn: ({ contractId }: {
    contractId: string;
}) => Promise<void>;
declare const signOut: () => void;
declare const actions: {
    functionCall: ({ methodName, gas, deposit, args, argsBase64, }: {
        methodName: string;
        gas?: string;
        deposit?: string;
        args?: Record<string, any>;
        argsBase64?: string;
    }) => {
        type: string;
        methodName: string;
        args: Record<string, any>;
        argsBase64: string;
        gas: string;
        deposit: string;
    };
    transfer: (yoctoAmount: string) => {
        type: string;
        deposit: string;
    };
    stakeNEAR: ({ amount, publicKey }: {
        amount: string;
        publicKey: string;
    }) => {
        type: string;
        stake: string;
        publicKey: string;
    };
    addFullAccessKey: ({ publicKey }: {
        publicKey: string;
    }) => {
        type: string;
        publicKey: string;
        accessKey: {
            permission: string;
        };
    };
    addLimitedAccessKey: ({ publicKey, allowance, accountId, methodNames, }: {
        publicKey: string;
        allowance: string;
        accountId: string;
        methodNames: string[];
    }) => {
        type: string;
        publicKey: string;
        accessKey: {
            permission: string;
            allowance: string;
            receiverId: string;
            methodNames: string[];
        };
    };
    deleteKey: ({ publicKey }: {
        publicKey: string;
    }) => {
        type: string;
        publicKey: string;
    };
    deleteAccount: ({ beneficiaryId }: {
        beneficiaryId: string;
    }) => {
        type: string;
        beneficiaryId: string;
    };
    createAccount: () => {
        type: string;
    };
    deployContract: ({ codeBase64 }: {
        codeBase64: string;
    }) => {
        type: string;
        codeBase64: string;
    };
};
declare const reExports: {
    utils: typeof reExportUtils;
    borshSchema: typeof reExportBorshSchema;
};
declare const utils: typeof reExportUtils;

export { type AccessKeyView, DEFAULT_NETWORK_ID, MaxBlockDelayMs, NETWORKS, WIDGET_URL, accessKey, account, accountId, actions, afterTxSent, authStatus, block, config, localTxHistory, publicKey, queryRpc, reExports, requestSignIn, sendTx, sendTxToRpc, signOut, tx, utils, view, withBlockId };
