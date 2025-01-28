import React, { useState } from 'react';
import CollectionAddressInput from './components/CollectionAddressInput';
import ReceiveSelector from './components/ReceiveSelector';
import SwapDirectionSelector from './components/SwapDirectionSelector';
import TokenMintAddressInput from './components/TokenMintAddressInput';
import SendSelector from './components/SendSelector';
import { AssetV1 } from '@metaplex-foundation/mpl-core';
import createUnifiedEscrow from './utils/createEscrow';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import { captureV1, fetchEscrowV1, MPL_HYBRID_PROGRAM_ID, mplHybrid, releaseV1 } from '@metaplex-foundation/mpl-hybrid';
import { DigitalAssetWithToken, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { signerIdentity } from '@metaplex-foundation/umi';
import { string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';
import { publicKey as convertToPublicKey } from '@metaplex-foundation/umi';
import { toast } from 'sonner';

// Define the step type
interface Step {
    id: number;
    name: string;
}

const Swap: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [collectionAddress, setCollectionAddress] = useState<string | null>(null);
    const [tokenMintAddress, setTokenMintAddress] = useState<string | null>(null)
    const [isNftToToken, setIsNftToToken] = useState<boolean>(true);
    const [selectedNft, setSelectedNft] = useState<AssetV1 | null>(null)
    const [selectedToken, setSelectedToken] = useState<DigitalAssetWithToken | null>(null)

    const wallet = useWallet();

    // Dynamically generate steps based on isNftToToken
    const getSteps = (): Step[] => {
        const baseSteps = [
            { id: 0, name: "Enter Collection Address" },
            { id: 1, name: "Enter Token Mint Address" },
            { id: 2, name: `Choose The Swap Direction ${isNftToToken ? "(NFT => TOKEN)" : "(TOKEN => NFT)"}` },
            { id: 3, name: `Choose ${!isNftToToken ? "Token" : "NFT"} to Swap` },
        ];

        if (!isNftToToken) {
            baseSteps.push({ id: 4, name: `Choose NFT to Receive` });
        }

        return baseSteps;
    };

    const steps = getSteps();

    const handleStepChange = (direction: "next" | "prev"): void => {
        if (direction === "next" && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (direction === "prev" && currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleSwapDirection = (): void => {
        setIsNftToToken(!isNftToToken);
        // Reset current step if it would be invalid after direction change
        if (currentStep === 4 && isNftToToken) {
            setCurrentStep(3);
        }
    };

    const handleFinalStep = async () => {
        const swapUmi = createUmi(clusterApiUrl("devnet"))
            .use(mplHybrid())
            .use(mplTokenMetadata())
            .use(walletAdapterIdentity(wallet));

        if (!wallet.publicKey) throw new Error("Wallet not connected")
        const validateEscrow = async function () {
            const umiWithSigner = swapUmi.use(signerIdentity(swapUmi.identity));
            try {
                if (!collectionAddress) {
                    throw new Error("Select a valid collection address");
                }
                const escrowAddress = umiWithSigner.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
                    string({ size: "variable" }).serialize("escrow"),
                    publicKeySerializer().serialize(collectionAddress),
                ]);

                try {
                    const escrow = await fetchEscrowV1(swapUmi, convertToPublicKey(escrowAddress));
                    return escrow;
                } catch (fetchError: any) {
                    // If the error is AccountNotFoundError, this means we need to create the escrow
                    if (fetchError.name === 'AccountNotFoundError') {
                        return null;
                    }
                    // If it's any other error, we should propagate it
                    throw fetchError;
                }
            } catch (error: any) {
                console.error("Escrow validation error:", error);
                toast.error(error.message);
                throw error; // Propagate the error to be handled by the parent try-catch
            }
        };
        try {
            let escrowPublickKey
            const validatedEscrow = await validateEscrow()
            if (validatedEscrow) { escrowPublickKey = validatedEscrow.publicKey }
            console.log(validatedEscrow, "Escrow Validated")
            if (!validatedEscrow) {
                const createEscrow = await createUnifiedEscrow(
                    swapUmi,
                    swapUmi.identity,
                    {
                        name: `Moonlambo ${wallet.publicKey?.toString().slice(0, 8)}`,
                        metadataBaseUrl: "https://base-uri/",
                        minIndex: 0,
                        maxIndex: 15,
                        feeWalletAddress: wallet.publicKey ? wallet.publicKey.toString() : "",
                        tokenSwapCost: 1,
                        tokenSwapFee: 1,
                        solSwapFee: 0.5,
                        reroll: true,
                        collectionAddress: collectionAddress || "",
                        tokenMintAddress: tokenMintAddress || "",
                    },
                )
                console.log(createEscrow)
                escrowPublickKey = createEscrow.escrowAddress
            }
            if (isNftToToken) {
                // Logic for swapping NFT to Token
                console.log("Swapping NFT to Token");
                await releaseV1(swapUmi, {
                    owner: swapUmi.identity,
                    escrow: convertToPublicKey(escrowPublickKey!),
                    asset: convertToPublicKey(selectedNft?.publicKey?.toString() || ""),
                    collection: convertToPublicKey(collectionAddress!),
                    feeProjectAccount: convertToPublicKey(wallet.publicKey.toString()),
                    token: convertToPublicKey(tokenMintAddress!),
                }).sendAndConfirm(swapUmi)

                toast.success("Token swapped Successfully")
                // setTimeout(() => fetchUserAssets(), 3000)

            } else {
                // Logic for swapping Token to NFT
                console.log("Swapping Token to NFT");
                await captureV1(swapUmi, {
                    // The owner of the asset being swapped.
                    owner: swapUmi.identity,
                    // The escrow configuration address.
                    escrow: convertToPublicKey(escrowPublickKey!),
                    // The Asset that will be swapped for SPL Tokens.
                    asset: convertToPublicKey('22222222222222222222222222222222'),
                    // The collection assigned to the escrow configuration.
                    collection: convertToPublicKey(collectionAddress!),
                    // The fee wallet address.
                    feeProjectAccount: convertToPublicKey(wallet.publicKey),
                    // The Token Account of the Wallet.
                    token: convertToPublicKey(tokenMintAddress!),
                }).sendAndConfirm(swapUmi)
            }
        } catch (error) {
            console.error("Error during swap:", error);
        }
    };

    const renderStep = (): JSX.Element | null => {
        switch (currentStep) {
            case 0:
                return <CollectionAddressInput
                    onNext={() => handleStepChange("next")}
                    collectionAddress={collectionAddress}
                    setCollectionAddress={setCollectionAddress}
                />;
            case 1:
                return <TokenMintAddressInput
                    onNext={() => handleStepChange("next")}
                    onPrev={() => handleStepChange("prev")}
                    tokenMintAddress={tokenMintAddress}
                    setTokenMintAddress={setTokenMintAddress}
                />;
            case 2:
                return <SwapDirectionSelector
                    onNext={() => handleStepChange("next")}
                    onPrev={() => handleStepChange("prev")}
                    isNftToToken={isNftToToken}
                    toggleSwapDirection={toggleSwapDirection}
                />;
            case 3:
                return <SendSelector
                    onNext={isNftToToken ? handleFinalStep : () => handleStepChange("next")}
                    onPrev={() => handleStepChange("prev")}
                    isNftToToken={isNftToToken}
                    collectionAddress={collectionAddress}
                    tokenMintAddress={tokenMintAddress}
                    selectedNft={selectedNft}
                    setSelectedNft={setSelectedNft}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                />;
            case 4:
                return !isNftToToken ? (
                    <ReceiveSelector
                        onPrev={() => handleStepChange("prev")}
                        isNftToToken={isNftToToken}
                        collectionAddress={collectionAddress}
                        tokenMintAddress={tokenMintAddress}
                    />
                ) : null;
            default:
                return null;
        }
    };

    return (
        <section className='text-white min-h-screen'>
            {renderStep()}
        </section>
    );
};

export default Swap;