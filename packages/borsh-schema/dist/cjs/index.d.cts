declare const getBorshSchema: {
    Ed25519Signature: {
        struct: {
            data: {
                array: {
                    type: string;
                    len: number;
                };
            };
        };
    };
    Secp256k1Signature: {
        struct: {
            data: {
                array: {
                    type: string;
                    len: number;
                };
            };
        };
    };
    Signature: {
        enum: ({
            struct: {
                ed25519Signature: {
                    struct: {
                        data: {
                            array: {
                                type: string;
                                len: number;
                            };
                        };
                    };
                };
                secp256k1Signature?: undefined;
            };
        } | {
            struct: {
                secp256k1Signature: {
                    struct: {
                        data: {
                            array: {
                                type: string;
                                len: number;
                            };
                        };
                    };
                };
                ed25519Signature?: undefined;
            };
        })[];
    };
    Ed25519Data: {
        struct: {
            data: {
                array: {
                    type: string;
                    len: number;
                };
            };
        };
    };
    Secp256k1Data: {
        struct: {
            data: {
                array: {
                    type: string;
                    len: number;
                };
            };
        };
    };
    PublicKey: {
        enum: ({
            struct: {
                ed25519Key: {
                    struct: {
                        data: {
                            array: {
                                type: string;
                                len: number;
                            };
                        };
                    };
                };
                secp256k1Key?: undefined;
            };
        } | {
            struct: {
                secp256k1Key: {
                    struct: {
                        data: {
                            array: {
                                type: string;
                                len: number;
                            };
                        };
                    };
                };
                ed25519Key?: undefined;
            };
        })[];
    };
    FunctionCallPermission: {
        struct: {
            allowance: {
                option: string;
            };
            receiverId: string;
            methodNames: {
                array: {
                    type: string;
                };
            };
        };
    };
    FullAccessPermission: {
        struct: {};
    };
    AccessKeyPermission: {
        enum: ({
            struct: {
                functionCall: {
                    struct: {
                        allowance: {
                            option: string;
                        };
                        receiverId: string;
                        methodNames: {
                            array: {
                                type: string;
                            };
                        };
                    };
                };
                fullAccess?: undefined;
            };
        } | {
            struct: {
                fullAccess: {
                    struct: {};
                };
                functionCall?: undefined;
            };
        })[];
    };
    AccessKey: {
        struct: {
            nonce: string;
            permission: {
                enum: ({
                    struct: {
                        functionCall: {
                            struct: {
                                allowance: {
                                    option: string;
                                };
                                receiverId: string;
                                methodNames: {
                                    array: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        fullAccess?: undefined;
                    };
                } | {
                    struct: {
                        fullAccess: {
                            struct: {};
                        };
                        functionCall?: undefined;
                    };
                })[];
            };
        };
    };
    CreateAccount: {
        struct: {};
    };
    DeployContract: {
        struct: {
            code: {
                array: {
                    type: string;
                };
            };
        };
    };
    FunctionCall: {
        struct: {
            methodName: string;
            args: {
                array: {
                    type: string;
                };
            };
            gas: string;
            deposit: string;
        };
    };
    Transfer: {
        struct: {
            deposit: string;
        };
    };
    Stake: {
        struct: {
            stake: string;
            publicKey: {
                enum: ({
                    struct: {
                        ed25519Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Key?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Key?: undefined;
                    };
                })[];
            };
        };
    };
    AddKey: {
        struct: {
            publicKey: {
                enum: ({
                    struct: {
                        ed25519Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Key?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Key?: undefined;
                    };
                })[];
            };
            accessKey: {
                struct: {
                    nonce: string;
                    permission: {
                        enum: ({
                            struct: {
                                functionCall: {
                                    struct: {
                                        allowance: {
                                            option: string;
                                        };
                                        receiverId: string;
                                        methodNames: {
                                            array: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                fullAccess?: undefined;
                            };
                        } | {
                            struct: {
                                fullAccess: {
                                    struct: {};
                                };
                                functionCall?: undefined;
                            };
                        })[];
                    };
                };
            };
        };
    };
    DeleteKey: {
        struct: {
            publicKey: {
                enum: ({
                    struct: {
                        ed25519Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Key?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Key?: undefined;
                    };
                })[];
            };
        };
    };
    DeleteAccount: {
        struct: {
            beneficiaryId: string;
        };
    };
    ClassicAction: {
        enum: ({
            struct: {
                createAccount: {
                    struct: {};
                };
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                deployContract: {
                    struct: {
                        code: {
                            array: {
                                type: string;
                            };
                        };
                    };
                };
                createAccount?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                functionCall: {
                    struct: {
                        methodName: string;
                        args: {
                            array: {
                                type: string;
                            };
                        };
                        gas: string;
                        deposit: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                transfer: {
                    struct: {
                        deposit: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                stake: {
                    struct: {
                        stake: string;
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                addKey: {
                    struct: {
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                        accessKey: {
                            struct: {
                                nonce: string;
                                permission: {
                                    enum: ({
                                        struct: {
                                            functionCall: {
                                                struct: {
                                                    allowance: {
                                                        option: string;
                                                    };
                                                    receiverId: string;
                                                    methodNames: {
                                                        array: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                            fullAccess?: undefined;
                                        };
                                    } | {
                                        struct: {
                                            fullAccess: {
                                                struct: {};
                                            };
                                            functionCall?: undefined;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                deleteKey: {
                    struct: {
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteAccount?: undefined;
            };
        } | {
            struct: {
                deleteAccount: {
                    struct: {
                        beneficiaryId: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
            };
        })[];
    };
    DelegateAction: {
        struct: {
            senderId: string;
            receiverId: string;
            actions: {
                array: {
                    type: {
                        enum: ({
                            struct: {
                                createAccount: {
                                    struct: {};
                                };
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                deployContract: {
                                    struct: {
                                        code: {
                                            array: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                functionCall: {
                                    struct: {
                                        methodName: string;
                                        args: {
                                            array: {
                                                type: string;
                                            };
                                        };
                                        gas: string;
                                        deposit: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                transfer: {
                                    struct: {
                                        deposit: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                stake: {
                                    struct: {
                                        stake: string;
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                addKey: {
                                    struct: {
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                        accessKey: {
                                            struct: {
                                                nonce: string;
                                                permission: {
                                                    enum: ({
                                                        struct: {
                                                            functionCall: {
                                                                struct: {
                                                                    allowance: {
                                                                        option: string;
                                                                    };
                                                                    receiverId: string;
                                                                    methodNames: {
                                                                        array: {
                                                                            type: string;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            fullAccess?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            fullAccess: {
                                                                struct: {};
                                                            };
                                                            functionCall?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                deleteKey: {
                                    struct: {
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        } | {
                            struct: {
                                deleteAccount: {
                                    struct: {
                                        beneficiaryId: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                            };
                        })[];
                    };
                };
            };
            nonce: string;
            maxBlockHeight: string;
            publicKey: {
                enum: ({
                    struct: {
                        ed25519Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Key?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Key?: undefined;
                    };
                })[];
            };
        };
    };
    SignedDelegate: {
        struct: {
            delegateAction: {
                struct: {
                    senderId: string;
                    receiverId: string;
                    actions: {
                        array: {
                            type: {
                                enum: ({
                                    struct: {
                                        createAccount: {
                                            struct: {};
                                        };
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deployContract: {
                                            struct: {
                                                code: {
                                                    array: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        functionCall: {
                                            struct: {
                                                methodName: string;
                                                args: {
                                                    array: {
                                                        type: string;
                                                    };
                                                };
                                                gas: string;
                                                deposit: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        transfer: {
                                            struct: {
                                                deposit: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        stake: {
                                            struct: {
                                                stake: string;
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        addKey: {
                                            struct: {
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                                accessKey: {
                                                    struct: {
                                                        nonce: string;
                                                        permission: {
                                                            enum: ({
                                                                struct: {
                                                                    functionCall: {
                                                                        struct: {
                                                                            allowance: {
                                                                                option: string;
                                                                            };
                                                                            receiverId: string;
                                                                            methodNames: {
                                                                                array: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    fullAccess?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    fullAccess: {
                                                                        struct: {};
                                                                    };
                                                                    functionCall?: undefined;
                                                                };
                                                            })[];
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deleteKey: {
                                            struct: {
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deleteAccount: {
                                            struct: {
                                                beneficiaryId: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                    };
                                })[];
                            };
                        };
                    };
                    nonce: string;
                    maxBlockHeight: string;
                    publicKey: {
                        enum: ({
                            struct: {
                                ed25519Key: {
                                    struct: {
                                        data: {
                                            array: {
                                                type: string;
                                                len: number;
                                            };
                                        };
                                    };
                                };
                                secp256k1Key?: undefined;
                            };
                        } | {
                            struct: {
                                secp256k1Key: {
                                    struct: {
                                        data: {
                                            array: {
                                                type: string;
                                                len: number;
                                            };
                                        };
                                    };
                                };
                                ed25519Key?: undefined;
                            };
                        })[];
                    };
                };
            };
            signature: {
                enum: ({
                    struct: {
                        ed25519Signature: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Signature?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Signature: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Signature?: undefined;
                    };
                })[];
            };
        };
    };
    Action: {
        enum: ({
            struct: {
                createAccount: {
                    struct: {};
                };
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                deployContract: {
                    struct: {
                        code: {
                            array: {
                                type: string;
                            };
                        };
                    };
                };
                createAccount?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                functionCall: {
                    struct: {
                        methodName: string;
                        args: {
                            array: {
                                type: string;
                            };
                        };
                        gas: string;
                        deposit: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                transfer: {
                    struct: {
                        deposit: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                stake: {
                    struct: {
                        stake: string;
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                addKey: {
                    struct: {
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                        accessKey: {
                            struct: {
                                nonce: string;
                                permission: {
                                    enum: ({
                                        struct: {
                                            functionCall: {
                                                struct: {
                                                    allowance: {
                                                        option: string;
                                                    };
                                                    receiverId: string;
                                                    methodNames: {
                                                        array: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                            fullAccess?: undefined;
                                        };
                                    } | {
                                        struct: {
                                            fullAccess: {
                                                struct: {};
                                            };
                                            functionCall?: undefined;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                deleteKey: {
                    struct: {
                        publicKey: {
                            enum: ({
                                struct: {
                                    ed25519Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Key?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Key: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Key?: undefined;
                                };
                            })[];
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteAccount?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                deleteAccount: {
                    struct: {
                        beneficiaryId: string;
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                signedDelegate?: undefined;
            };
        } | {
            struct: {
                signedDelegate: {
                    struct: {
                        delegateAction: {
                            struct: {
                                senderId: string;
                                receiverId: string;
                                actions: {
                                    array: {
                                        type: {
                                            enum: ({
                                                struct: {
                                                    createAccount: {
                                                        struct: {};
                                                    };
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    deployContract: {
                                                        struct: {
                                                            code: {
                                                                array: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    functionCall: {
                                                        struct: {
                                                            methodName: string;
                                                            args: {
                                                                array: {
                                                                    type: string;
                                                                };
                                                            };
                                                            gas: string;
                                                            deposit: string;
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    transfer: {
                                                        struct: {
                                                            deposit: string;
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    stake: {
                                                        struct: {
                                                            stake: string;
                                                            publicKey: {
                                                                enum: ({
                                                                    struct: {
                                                                        ed25519Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        secp256k1Key?: undefined;
                                                                    };
                                                                } | {
                                                                    struct: {
                                                                        secp256k1Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        ed25519Key?: undefined;
                                                                    };
                                                                })[];
                                                            };
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    addKey: {
                                                        struct: {
                                                            publicKey: {
                                                                enum: ({
                                                                    struct: {
                                                                        ed25519Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        secp256k1Key?: undefined;
                                                                    };
                                                                } | {
                                                                    struct: {
                                                                        secp256k1Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        ed25519Key?: undefined;
                                                                    };
                                                                })[];
                                                            };
                                                            accessKey: {
                                                                struct: {
                                                                    nonce: string;
                                                                    permission: {
                                                                        enum: ({
                                                                            struct: {
                                                                                functionCall: {
                                                                                    struct: {
                                                                                        allowance: {
                                                                                            option: string;
                                                                                        };
                                                                                        receiverId: string;
                                                                                        methodNames: {
                                                                                            array: {
                                                                                                type: string;
                                                                                            };
                                                                                        };
                                                                                    };
                                                                                };
                                                                                fullAccess?: undefined;
                                                                            };
                                                                        } | {
                                                                            struct: {
                                                                                fullAccess: {
                                                                                    struct: {};
                                                                                };
                                                                                functionCall?: undefined;
                                                                            };
                                                                        })[];
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    deleteKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    deleteKey: {
                                                        struct: {
                                                            publicKey: {
                                                                enum: ({
                                                                    struct: {
                                                                        ed25519Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        secp256k1Key?: undefined;
                                                                    };
                                                                } | {
                                                                    struct: {
                                                                        secp256k1Key: {
                                                                            struct: {
                                                                                data: {
                                                                                    array: {
                                                                                        type: string;
                                                                                        len: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                        ed25519Key?: undefined;
                                                                    };
                                                                })[];
                                                            };
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteAccount?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    deleteAccount: {
                                                        struct: {
                                                            beneficiaryId: string;
                                                        };
                                                    };
                                                    createAccount?: undefined;
                                                    deployContract?: undefined;
                                                    functionCall?: undefined;
                                                    transfer?: undefined;
                                                    stake?: undefined;
                                                    addKey?: undefined;
                                                    deleteKey?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                nonce: string;
                                maxBlockHeight: string;
                                publicKey: {
                                    enum: ({
                                        struct: {
                                            ed25519Key: {
                                                struct: {
                                                    data: {
                                                        array: {
                                                            type: string;
                                                            len: number;
                                                        };
                                                    };
                                                };
                                            };
                                            secp256k1Key?: undefined;
                                        };
                                    } | {
                                        struct: {
                                            secp256k1Key: {
                                                struct: {
                                                    data: {
                                                        array: {
                                                            type: string;
                                                            len: number;
                                                        };
                                                    };
                                                };
                                            };
                                            ed25519Key?: undefined;
                                        };
                                    })[];
                                };
                            };
                        };
                        signature: {
                            enum: ({
                                struct: {
                                    ed25519Signature: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    secp256k1Signature?: undefined;
                                };
                            } | {
                                struct: {
                                    secp256k1Signature: {
                                        struct: {
                                            data: {
                                                array: {
                                                    type: string;
                                                    len: number;
                                                };
                                            };
                                        };
                                    };
                                    ed25519Signature?: undefined;
                                };
                            })[];
                        };
                    };
                };
                createAccount?: undefined;
                deployContract?: undefined;
                functionCall?: undefined;
                transfer?: undefined;
                stake?: undefined;
                addKey?: undefined;
                deleteKey?: undefined;
                deleteAccount?: undefined;
            };
        })[];
    };
    Transaction: {
        struct: {
            signerId: string;
            publicKey: {
                enum: ({
                    struct: {
                        ed25519Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Key?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Key: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Key?: undefined;
                    };
                })[];
            };
            nonce: string;
            receiverId: string;
            blockHash: {
                array: {
                    type: string;
                    len: number;
                };
            };
            actions: {
                array: {
                    type: {
                        enum: ({
                            struct: {
                                createAccount: {
                                    struct: {};
                                };
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                deployContract: {
                                    struct: {
                                        code: {
                                            array: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                functionCall: {
                                    struct: {
                                        methodName: string;
                                        args: {
                                            array: {
                                                type: string;
                                            };
                                        };
                                        gas: string;
                                        deposit: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                transfer: {
                                    struct: {
                                        deposit: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                stake: {
                                    struct: {
                                        stake: string;
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                addKey: {
                                    struct: {
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                        accessKey: {
                                            struct: {
                                                nonce: string;
                                                permission: {
                                                    enum: ({
                                                        struct: {
                                                            functionCall: {
                                                                struct: {
                                                                    allowance: {
                                                                        option: string;
                                                                    };
                                                                    receiverId: string;
                                                                    methodNames: {
                                                                        array: {
                                                                            type: string;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            fullAccess?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            fullAccess: {
                                                                struct: {};
                                                            };
                                                            functionCall?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                deleteKey: {
                                    struct: {
                                        publicKey: {
                                            enum: ({
                                                struct: {
                                                    ed25519Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Key?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Key: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Key?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteAccount?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                deleteAccount: {
                                    struct: {
                                        beneficiaryId: string;
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                signedDelegate?: undefined;
                            };
                        } | {
                            struct: {
                                signedDelegate: {
                                    struct: {
                                        delegateAction: {
                                            struct: {
                                                senderId: string;
                                                receiverId: string;
                                                actions: {
                                                    array: {
                                                        type: {
                                                            enum: ({
                                                                struct: {
                                                                    createAccount: {
                                                                        struct: {};
                                                                    };
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    deployContract: {
                                                                        struct: {
                                                                            code: {
                                                                                array: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    functionCall: {
                                                                        struct: {
                                                                            methodName: string;
                                                                            args: {
                                                                                array: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                            gas: string;
                                                                            deposit: string;
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    transfer: {
                                                                        struct: {
                                                                            deposit: string;
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    stake: {
                                                                        struct: {
                                                                            stake: string;
                                                                            publicKey: {
                                                                                enum: ({
                                                                                    struct: {
                                                                                        ed25519Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        secp256k1Key?: undefined;
                                                                                    };
                                                                                } | {
                                                                                    struct: {
                                                                                        secp256k1Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        ed25519Key?: undefined;
                                                                                    };
                                                                                })[];
                                                                            };
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    addKey: {
                                                                        struct: {
                                                                            publicKey: {
                                                                                enum: ({
                                                                                    struct: {
                                                                                        ed25519Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        secp256k1Key?: undefined;
                                                                                    };
                                                                                } | {
                                                                                    struct: {
                                                                                        secp256k1Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        ed25519Key?: undefined;
                                                                                    };
                                                                                })[];
                                                                            };
                                                                            accessKey: {
                                                                                struct: {
                                                                                    nonce: string;
                                                                                    permission: {
                                                                                        enum: ({
                                                                                            struct: {
                                                                                                functionCall: {
                                                                                                    struct: {
                                                                                                        allowance: {
                                                                                                            option: string;
                                                                                                        };
                                                                                                        receiverId: string;
                                                                                                        methodNames: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                fullAccess?: undefined;
                                                                                            };
                                                                                        } | {
                                                                                            struct: {
                                                                                                fullAccess: {
                                                                                                    struct: {};
                                                                                                };
                                                                                                functionCall?: undefined;
                                                                                            };
                                                                                        })[];
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    deleteKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    deleteKey: {
                                                                        struct: {
                                                                            publicKey: {
                                                                                enum: ({
                                                                                    struct: {
                                                                                        ed25519Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        secp256k1Key?: undefined;
                                                                                    };
                                                                                } | {
                                                                                    struct: {
                                                                                        secp256k1Key: {
                                                                                            struct: {
                                                                                                data: {
                                                                                                    array: {
                                                                                                        type: string;
                                                                                                        len: number;
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                        };
                                                                                        ed25519Key?: undefined;
                                                                                    };
                                                                                })[];
                                                                            };
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteAccount?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    deleteAccount: {
                                                                        struct: {
                                                                            beneficiaryId: string;
                                                                        };
                                                                    };
                                                                    createAccount?: undefined;
                                                                    deployContract?: undefined;
                                                                    functionCall?: undefined;
                                                                    transfer?: undefined;
                                                                    stake?: undefined;
                                                                    addKey?: undefined;
                                                                    deleteKey?: undefined;
                                                                };
                                                            })[];
                                                        };
                                                    };
                                                };
                                                nonce: string;
                                                maxBlockHeight: string;
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        signature: {
                                            enum: ({
                                                struct: {
                                                    ed25519Signature: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    secp256k1Signature?: undefined;
                                                };
                                            } | {
                                                struct: {
                                                    secp256k1Signature: {
                                                        struct: {
                                                            data: {
                                                                array: {
                                                                    type: string;
                                                                    len: number;
                                                                };
                                                            };
                                                        };
                                                    };
                                                    ed25519Signature?: undefined;
                                                };
                                            })[];
                                        };
                                    };
                                };
                                createAccount?: undefined;
                                deployContract?: undefined;
                                functionCall?: undefined;
                                transfer?: undefined;
                                stake?: undefined;
                                addKey?: undefined;
                                deleteKey?: undefined;
                                deleteAccount?: undefined;
                            };
                        })[];
                    };
                };
            };
        };
    };
    SignedTransaction: {
        struct: {
            transaction: {
                struct: {
                    signerId: string;
                    publicKey: {
                        enum: ({
                            struct: {
                                ed25519Key: {
                                    struct: {
                                        data: {
                                            array: {
                                                type: string;
                                                len: number;
                                            };
                                        };
                                    };
                                };
                                secp256k1Key?: undefined;
                            };
                        } | {
                            struct: {
                                secp256k1Key: {
                                    struct: {
                                        data: {
                                            array: {
                                                type: string;
                                                len: number;
                                            };
                                        };
                                    };
                                };
                                ed25519Key?: undefined;
                            };
                        })[];
                    };
                    nonce: string;
                    receiverId: string;
                    blockHash: {
                        array: {
                            type: string;
                            len: number;
                        };
                    };
                    actions: {
                        array: {
                            type: {
                                enum: ({
                                    struct: {
                                        createAccount: {
                                            struct: {};
                                        };
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deployContract: {
                                            struct: {
                                                code: {
                                                    array: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        functionCall: {
                                            struct: {
                                                methodName: string;
                                                args: {
                                                    array: {
                                                        type: string;
                                                    };
                                                };
                                                gas: string;
                                                deposit: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        transfer: {
                                            struct: {
                                                deposit: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        stake: {
                                            struct: {
                                                stake: string;
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        addKey: {
                                            struct: {
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                                accessKey: {
                                                    struct: {
                                                        nonce: string;
                                                        permission: {
                                                            enum: ({
                                                                struct: {
                                                                    functionCall: {
                                                                        struct: {
                                                                            allowance: {
                                                                                option: string;
                                                                            };
                                                                            receiverId: string;
                                                                            methodNames: {
                                                                                array: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    fullAccess?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    fullAccess: {
                                                                        struct: {};
                                                                    };
                                                                    functionCall?: undefined;
                                                                };
                                                            })[];
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deleteKey: {
                                            struct: {
                                                publicKey: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Key?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Key: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Key?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteAccount?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        deleteAccount: {
                                            struct: {
                                                beneficiaryId: string;
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        signedDelegate?: undefined;
                                    };
                                } | {
                                    struct: {
                                        signedDelegate: {
                                            struct: {
                                                delegateAction: {
                                                    struct: {
                                                        senderId: string;
                                                        receiverId: string;
                                                        actions: {
                                                            array: {
                                                                type: {
                                                                    enum: ({
                                                                        struct: {
                                                                            createAccount: {
                                                                                struct: {};
                                                                            };
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            deployContract: {
                                                                                struct: {
                                                                                    code: {
                                                                                        array: {
                                                                                            type: string;
                                                                                        };
                                                                                    };
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            functionCall: {
                                                                                struct: {
                                                                                    methodName: string;
                                                                                    args: {
                                                                                        array: {
                                                                                            type: string;
                                                                                        };
                                                                                    };
                                                                                    gas: string;
                                                                                    deposit: string;
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            transfer: {
                                                                                struct: {
                                                                                    deposit: string;
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            stake: {
                                                                                struct: {
                                                                                    stake: string;
                                                                                    publicKey: {
                                                                                        enum: ({
                                                                                            struct: {
                                                                                                ed25519Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                secp256k1Key?: undefined;
                                                                                            };
                                                                                        } | {
                                                                                            struct: {
                                                                                                secp256k1Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                ed25519Key?: undefined;
                                                                                            };
                                                                                        })[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            addKey: {
                                                                                struct: {
                                                                                    publicKey: {
                                                                                        enum: ({
                                                                                            struct: {
                                                                                                ed25519Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                secp256k1Key?: undefined;
                                                                                            };
                                                                                        } | {
                                                                                            struct: {
                                                                                                secp256k1Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                ed25519Key?: undefined;
                                                                                            };
                                                                                        })[];
                                                                                    };
                                                                                    accessKey: {
                                                                                        struct: {
                                                                                            nonce: string;
                                                                                            permission: {
                                                                                                enum: ({
                                                                                                    struct: {
                                                                                                        functionCall: {
                                                                                                            struct: {
                                                                                                                allowance: {
                                                                                                                    option: string;
                                                                                                                };
                                                                                                                receiverId: string;
                                                                                                                methodNames: {
                                                                                                                    array: {
                                                                                                                        type: string;
                                                                                                                    };
                                                                                                                };
                                                                                                            };
                                                                                                        };
                                                                                                        fullAccess?: undefined;
                                                                                                    };
                                                                                                } | {
                                                                                                    struct: {
                                                                                                        fullAccess: {
                                                                                                            struct: {};
                                                                                                        };
                                                                                                        functionCall?: undefined;
                                                                                                    };
                                                                                                })[];
                                                                                            };
                                                                                        };
                                                                                    };
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            deleteKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            deleteKey: {
                                                                                struct: {
                                                                                    publicKey: {
                                                                                        enum: ({
                                                                                            struct: {
                                                                                                ed25519Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                secp256k1Key?: undefined;
                                                                                            };
                                                                                        } | {
                                                                                            struct: {
                                                                                                secp256k1Key: {
                                                                                                    struct: {
                                                                                                        data: {
                                                                                                            array: {
                                                                                                                type: string;
                                                                                                                len: number;
                                                                                                            };
                                                                                                        };
                                                                                                    };
                                                                                                };
                                                                                                ed25519Key?: undefined;
                                                                                            };
                                                                                        })[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteAccount?: undefined;
                                                                        };
                                                                    } | {
                                                                        struct: {
                                                                            deleteAccount: {
                                                                                struct: {
                                                                                    beneficiaryId: string;
                                                                                };
                                                                            };
                                                                            createAccount?: undefined;
                                                                            deployContract?: undefined;
                                                                            functionCall?: undefined;
                                                                            transfer?: undefined;
                                                                            stake?: undefined;
                                                                            addKey?: undefined;
                                                                            deleteKey?: undefined;
                                                                        };
                                                                    })[];
                                                                };
                                                            };
                                                        };
                                                        nonce: string;
                                                        maxBlockHeight: string;
                                                        publicKey: {
                                                            enum: ({
                                                                struct: {
                                                                    ed25519Key: {
                                                                        struct: {
                                                                            data: {
                                                                                array: {
                                                                                    type: string;
                                                                                    len: number;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    secp256k1Key?: undefined;
                                                                };
                                                            } | {
                                                                struct: {
                                                                    secp256k1Key: {
                                                                        struct: {
                                                                            data: {
                                                                                array: {
                                                                                    type: string;
                                                                                    len: number;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    ed25519Key?: undefined;
                                                                };
                                                            })[];
                                                        };
                                                    };
                                                };
                                                signature: {
                                                    enum: ({
                                                        struct: {
                                                            ed25519Signature: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            secp256k1Signature?: undefined;
                                                        };
                                                    } | {
                                                        struct: {
                                                            secp256k1Signature: {
                                                                struct: {
                                                                    data: {
                                                                        array: {
                                                                            type: string;
                                                                            len: number;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            ed25519Signature?: undefined;
                                                        };
                                                    })[];
                                                };
                                            };
                                        };
                                        createAccount?: undefined;
                                        deployContract?: undefined;
                                        functionCall?: undefined;
                                        transfer?: undefined;
                                        stake?: undefined;
                                        addKey?: undefined;
                                        deleteKey?: undefined;
                                        deleteAccount?: undefined;
                                    };
                                })[];
                            };
                        };
                    };
                };
            };
            signature: {
                enum: ({
                    struct: {
                        ed25519Signature: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        secp256k1Signature?: undefined;
                    };
                } | {
                    struct: {
                        secp256k1Signature: {
                            struct: {
                                data: {
                                    array: {
                                        type: string;
                                        len: number;
                                    };
                                };
                            };
                        };
                        ed25519Signature?: undefined;
                    };
                })[];
            };
        };
    };
};

export { getBorshSchema };
