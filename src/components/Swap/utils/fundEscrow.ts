import { PublicKey, Umi } from '@metaplex-foundation/umi';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { transferTokens, createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox';

/**
 * Parameters for funding an escrow account
 */
interface FundEscrowParams {
    /** The Umi instance for blockchain interaction */
    umi: Umi;
    /** The public key of the escrow configuration */
    escrowConfigurationAddress: PublicKey;
    /** The mint address of the token to be transferred */
    tokenMint: PublicKey;
    /** Amount of tokens to transfer (in lamports) */
    amount: number;
}

/**
 * Funds an escrow account with specified tokens
 * 
 * @param params - The parameters for funding the escrow
 * @returns Promise that resolves when the transaction is confirmed
 * @throws If the transaction fails
 * 
 * @example
 * ```typescript
 * await fundEscrow({
 *   umi,
 *   escrowConfigurationAddress: publicKey('11111...'),
 *   tokenMint: publicKey('22222...'),
 *   amount: 100000
 * });
 * ```
 */
export async function fundEscrow({
    umi,
    escrowConfigurationAddress,
    tokenMint,
    amount
}: FundEscrowParams): Promise<void> {
    // Generate the Token Account PDA from the funding wallet
    const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
        owner: umi.identity.publicKey,
        mint: tokenMint,
    });
    console.log(sourceTokenAccountPda, "Source Token Account PDA")

    // Generate the Token Account PDA for the escrow destination
    const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
        owner: escrowConfigurationAddress,
        mint: tokenMint,
    });

    console.log(escrowTokenAccountPda, "Escrow Token Account PDA")

    // Execute transfer while creating destination account if needed
    await createTokenIfMissing(umi, {
        mint: tokenMint,
        owner: escrowConfigurationAddress,
        token: escrowTokenAccountPda,
        payer: umi.identity,
    })
        .add(
            transferTokens(umi, {
                source: sourceTokenAccountPda,
                destination: escrowTokenAccountPda,
                amount,
            })
        )
        .sendAndConfirm(umi);
}