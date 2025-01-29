import { Pda, PublicKey, publicKey } from '@metaplex-foundation/umi';
import { fetchEscrowV1, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid';

/**
 * Utility function to update the escrow configuration.
 * 
 * @param {Object} umi - The Umi instance.
 * @param {PublicKey} escrowConfigurationAddress - The public key of the escrow configuration.
 * @param {Object} updates - An object containing the fields to update.
 * @returns {Promise<TransactionSignature>} - The transaction signature of the update.
 */



interface UpdateEscrowConfigurationParams {
    umi: any; // Replace 'any' with the actual type of 'umi' if known
    escrowConfigurationAddress: string;
    updates: Partial<EscrowConfigurationData>;
    // updates: Partial<EscrowConfigurationData>;
}

interface EscrowConfigurationData {
    name?: string;
    uri?: string;
    token?: PublicKey | Pda;
    feeLocation?: PublicKey | Pda;
    feeAta?: Pda;
    min?: number;
    max?: number;
    amount?: number;
    feeAmount?: number;
    // solFeeAmount?: SolAmount.basisPoints
    path?: 0 | 1

}

async function updateEscrowConfiguration({ umi, escrowConfigurationAddress, updates }: UpdateEscrowConfigurationParams) {
    try {
        // Fetch the current escrow configuration data.
        const escrowConfigurationData = await fetchEscrowV1(umi, publicKey(escrowConfigurationAddress));

        // Merge the current data with the updates.
        const updatedEscrowConfiguration = {
            ...escrowConfigurationData,
            escrow: publicKey(escrowConfigurationAddress),
            authority: umi.identity,
            ...updates,
        };

        // Send the update transaction.
        const result = await updateEscrowV1(umi, updatedEscrowConfiguration).sendAndConfirm(umi);

        console.log('Escrow configuration updated successfully. Transaction signature:', result.signature);
        return result.signature;
    } catch (error) {
        console.error('Failed to update escrow configuration:', error);
        throw error; // Re-throw the error for further handling if needed.
    }
}

export default updateEscrowConfiguration

// Example usage:
// (async () => {
//     const umi = // your Umi instance;
//     const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

//     const updates = {
//         feeAmount: 100000, // Example: Update fee amount to 100,000 lamports.
//         solFeeAmount: sol(0.5).basisPoints, // Example: Update SOL fee to 0.5 SOL.
//         name: "Updated Escrow Name", // Example: Update the escrow name.
//         uri: "https://shdw-drive.genesysgo.net/<new-bucket-id>/", // Example: Update the metadata URI.
//         // Add any other fields you wish to update here.
//     };

//     try {
//         const signature = await updateEscrowConfiguration(umi, escrowConfigurationAddress, updates);
//         console.log('Transaction successful with signature:', signature);
//     } catch (error) {
//         console.error('Transaction failed:', error);
//     }
// })();