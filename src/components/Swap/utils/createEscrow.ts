import {
    initEscrowV1,
    MPL_HYBRID_PROGRAM_ID,
} from "@metaplex-foundation/mpl-hybrid";
import {
    findAssociatedTokenPda,
    SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
    setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import {
    PublicKey,
    Umi,
    publicKey,
    sol,
    TransactionBuilder,
    Signer,
    signerIdentity,
    RpcConfirmTransactionResult,
    Pda
} from "@metaplex-foundation/umi";
import {
    base58,
    publicKey as publicKeySerializer,
    string,
} from "@metaplex-foundation/umi/serializers";

// Types for configuration
interface EscrowConfig {
    name: string;
    metadataBaseUrl: string;
    minIndex: number;
    maxIndex: number;
    feeWalletAddress: string;
    tokenSwapCost: number;
    tokenSwapFee: number;
    solSwapFee: number;
    reroll?: boolean;
    collectionAddress: string;
    tokenMintAddress: string;
}

interface TransactionSettings {
    commitment?: "processed" | "confirmed" | "finalized";
    skipPreflight?: boolean;
}

interface TransactionResult {
    signature: string[];
    confirmation: RpcConfirmTransactionResult
    // confirmation: {
    //     signature: Uint8Array;
    //     blockhash: string;
    //     slot: number;
    // };
}

interface CreateEscrowResult {
    transaction: TransactionResult,
    escrowAddress: PublicKey | Pda

}

// Helper function to send and confirm transaction
async function sendAndConfirmTransaction(
    umi: Umi,
    tx: TransactionBuilder,
    settings?: TransactionSettings
): Promise<TransactionResult> {
    const blockhash = await umi.rpc.getLatestBlockhash({
        commitment: settings?.commitment || "confirmed",
    });

    const transactions = tx
        .add(setComputeUnitPrice(umi, { microLamports: BigInt(100000) }))
        .setBlockhash(blockhash);

    const signedTx = await transactions.buildAndSign(umi);

    const signature = await umi.rpc
        .sendTransaction(signedTx, {
            preflightCommitment: settings?.commitment || "confirmed",
            commitment: settings?.commitment || "confirmed",
            skipPreflight: settings?.skipPreflight || false,
        })
        .catch((err: Error) => {
            throw new Error(`Transaction failed: ${err.message}`);
        });

    const confirmation = await umi.rpc.confirmTransaction(signature, {
        strategy: { type: "blockhash", ...blockhash },
        commitment: settings?.commitment || "confirmed",
    });

    return {
        signature: base58.deserialize(signature) as string[],
        confirmation,
    };
}

// Main escrow creation function
async function createUnifiedEscrow(
    umi: Umi,
    signer: Signer,
    config: EscrowConfig,
    settings?: TransactionSettings
): Promise<CreateEscrowResult> {
    // Validate required parameters
    if (!config.collectionAddress || !config.tokenMintAddress) {
        throw new Error("Collection address and token mint address are required");
    }

    // Setup UMI with signer
    const umiWithSigner = umi.use(signerIdentity(signer));

    // Calculate fee token account
    const feeTokenAccount = findAssociatedTokenPda(umiWithSigner, {
        mint: publicKey(config.tokenMintAddress),
        owner: publicKey(config.feeWalletAddress),
    });

    // Calculate escrow address
    const escrowAddress = umiWithSigner.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
        string({ size: "variable" }).serialize("escrow"),
        publicKeySerializer().serialize(config.collectionAddress),
    ]);

    // Initialize escrow transaction
    const initTx = initEscrowV1(umiWithSigner, {
        name: config.name,
        uri: config.metadataBaseUrl,
        escrow: escrowAddress,
        collection: publicKey(config.collectionAddress),
        token: publicKey(config.tokenMintAddress),
        feeLocation: publicKey(config.feeWalletAddress),
        feeAta: feeTokenAccount,
        min: config.minIndex,
        max: config.maxIndex,
        amount: config.tokenSwapCost,
        feeAmount: config.tokenSwapFee,
        solFeeAmount: sol(config.solSwapFee).basisPoints,
        path: config.reroll ? 1 : 0,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
    });

    const transaction = await sendAndConfirmTransaction(umiWithSigner, initTx, settings)
    // Send and confirm transaction
    return { transaction, escrowAddress };
}

// Export types and function
export type {
    EscrowConfig,
    TransactionSettings,
    TransactionResult,
};

export default createUnifiedEscrow;