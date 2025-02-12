import { createTokenIfMissing, fetchToken, findAssociatedTokenPda, transferTokens } from "@metaplex-foundation/mpl-toolbox"
import { publicKey, Umi } from "@metaplex-foundation/umi"


interface IFundEscrowProps {
    umi: Umi,
    escrowConfigurationAdd: string,
    tokenMintPublicKey: string,
    decimals?: number
}

export default async function fundEscow({ umi,
    escrowConfigurationAdd,
    tokenMintPublicKey,
}: IFundEscrowProps) {
    try {
        const INITIAL_FUNDING_AMOUNT = 1000000;
        console.log('Starting escrow funding process...');

        // Get source token account (your wallet's token account)
        const sourceTokenAccount = findAssociatedTokenPda(umi, {
            mint: publicKey(tokenMintPublicKey),
            owner: umi.identity.publicKey
        });
        console.log('Gotten source token account, about to get escrow public key again', sourceTokenAccount);

        // Get escrow's token account
        const escrowAddressPublicKey = publicKey(escrowConfigurationAdd);

        const escrowTokenAccount = findAssociatedTokenPda(umi, {
            mint: publicKey(tokenMintPublicKey),
            owner: escrowAddressPublicKey
        });
        console.log('Gotten escrow public key and token account, about to get token balance from token account', escrowTokenAccount);

        // Check source token balance
        const sourceToken = await fetchToken(umi, sourceTokenAccount);
        console.log(sourceToken, "Source token")
        console.log(Number(sourceToken.amount), "Source token amount")
        if (Number(sourceToken.amount) < INITIAL_FUNDING_AMOUNT) {
            throw new Error('Insufficient token balance for funding');
        }

        // Create escrow token account if it doesn't exist and transfer tokens
        console.log('Balance is all good, about to process tx');
        const tx = await createTokenIfMissing(umi, {
            mint: publicKey(tokenMintPublicKey),
            owner: publicKey(escrowConfigurationAdd),
            token: escrowTokenAccount,
            payer: umi.identity,
        }).add(
            transferTokens(umi, {
                source: sourceTokenAccount,
                destination: escrowTokenAccount,
                amount: INITIAL_FUNDING_AMOUNT,
            })
        );
        console.log('Confirming fund tx next');

        const signature = await tx.sendAndConfirm(umi);
        console.log('Escrow funded successfully:', signature);

        return signature;
    } catch (error) {
        console.error('Failed to fund escrow:', error);
        throw error;
    }
}

// const fundEscrow = async function ({ umi, escrowConfigurationAdd, tokenMintPublicKey, decimals = 9 }: IFundEscrowProps) {
//     const transferAmount = 1 * (10 ** decimals);

//     // Address of your escrow configuration.
//     const escrowConfigurationAddress = publicKey(escrowConfigurationAdd)
//     // Address of the SPL token.
//     const tokenMint = publicKey(tokenMintPublicKey)

//     // Generate the Token Account PDA from the funding wallet.
//     const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
//         owner: umi.identity.publicKey,
//         mint: tokenMint,
//     })

//     // Remove later
//     const tokenAccount = await umi.rpc.getAccount(publicKey(sourceTokenAccountPda));
//     console.log('Token account balance:', tokenAccount);
//     // Remove later

//     // Generate the Token Account PDA for the escrow destination.
//     const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
//         owner: escrowConfigurationAddress,
//         mint: tokenMint,
//     })

//     // Execute transfer of tokens while also checking if the
//     // destination token account exists, if not, create it.
//     await createTokenIfMissing(umi, {
//         mint: tokenMint,
//         owner: escrowConfigurationAddress,
//         token: escrowTokenAccountPda,
//         payer: umi.identity,
//     })
//         .add(
//             transferTokens(umi, {
//                 source: sourceTokenAccountPda,
//                 destination: escrowTokenAccountPda,
//                 // amount is calculated in lamports and decimals.
//                 amount: transferAmount,
//             })
//         )
//         .sendAndConfirm(umi)
// }

// export default fundEscrow