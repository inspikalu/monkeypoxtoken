import React, { useState, useEffect } from 'react';
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
import fundEscrow from '../utils/fund-escrow';

// Define the step type
interface Step {
    id: number;
    name: string;
}

const Swap: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [collectionAddress, setCollectionAddress] = useState<string | null>(null);
    const [tokenMintAddress, setTokenMintAddress] = useState<string | null>(null);
    const [isNftToToken, setIsNftToToken] = useState<boolean>(true);
    const [selectedNft, setSelectedNft] = useState<AssetV1 | null>(null);
    const [selectedToken, setSelectedToken] = useState<DigitalAssetWithToken | null>(null);
    const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedEscrowAsset, setSelectedEscrowAsset] = useState<AssetV1 | null>(null);

    const wallet = useWallet();

    const swapUmi = createUmi(clusterApiUrl("devnet"))
        .use(mplHybrid())
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));

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
        if (currentStep === 4 && isNftToToken) {
            setCurrentStep(3);
        }
    };

    const validateAndGetEscrow = async (): Promise<string> => {
        if (!wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        if (!collectionAddress) {
            throw new Error("Select a valid collection address");
        }

        const umiWithSigner = swapUmi.use(signerIdentity(swapUmi.identity));
        const escrowPda = umiWithSigner.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
            string({ size: "variable" }).serialize("escrow"),
            publicKeySerializer().serialize(collectionAddress),
        ]);

        try {
            const escrow = await fetchEscrowV1(swapUmi, convertToPublicKey(escrowPda));
            return convertToPublicKey(escrow);
        } catch (fetchError: any) {
            if (fetchError.name === 'AccountNotFoundError') {
                // Create new escrow
                const createEscrow = await createUnifiedEscrow(
                    swapUmi,
                    swapUmi.identity,
                    {
                        name: `Moonlambo ${wallet.publicKey.toString().slice(0, 8)}`,
                        metadataBaseUrl: "https://base-uri/",
                        minIndex: 0,
                        maxIndex: 15,
                        feeWalletAddress: wallet.publicKey.toString(),
                        tokenSwapCost: 1,
                        tokenSwapFee: 1,
                        solSwapFee: 0.5,
                        reroll: true,
                        collectionAddress: collectionAddress,
                        tokenMintAddress: tokenMintAddress || "",
                    }
                );
                return convertToPublicKey(createEscrow.escrowAddress);
            }
            throw fetchError;
        }
    };

    useEffect(() => {
        const initializeEscrow = async () => {
            if (collectionAddress && tokenMintAddress && !escrowAddress) {
                try {
                    setIsLoading(true);
                    const address = await validateAndGetEscrow();
                    setEscrowAddress(address);
                } catch (error: any) {
                    console.error("Error initializing escrow:", error);
                    toast.error(error.message || "Failed to initialize escrow");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initializeEscrow();
    }, [collectionAddress, tokenMintAddress]);

    const handleFinalStep = async () => {
        if (!escrowAddress) {
            toast.error("Escrow address not initialized");
            return;
        }

        if (!wallet.publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        if (isNftToToken && !selectedNft) {
            toast.error("No NFT selected");
            return;
        }


        // Proceed with token to NFT swap
        await processSwap();
    };

    const processSwap = async () => {
        try {
            if (!wallet.publicKey) throw new Error("Please connect wallet")
            setIsLoading(true);

            if (isNftToToken) {
                if (!selectedNft) {
                    throw new Error("No NFT selected");
                }
                if (!tokenMintAddress) {
                    throw new Error("No token mint address provided");
                }
                if (!escrowAddress) {
                    throw new Error("No escrow address provided");
                }

                const balance = await swapUmi.rpc.getBalance(swapUmi.identity.publicKey);
                console.log('SOL balance:', balance);
                await fundEscrow({
                    umi: swapUmi,
                    escrowConfigurationAdd: escrowAddress?.toString(),
                    tokenMintPublicKey: tokenMintAddress,
                })

                await releaseV1(swapUmi, {
                    owner: swapUmi.identity,
                    escrow: convertToPublicKey(escrowAddress!),
                    asset: convertToPublicKey(selectedNft.publicKey.toString()),
                    collection: convertToPublicKey(collectionAddress!),
                    feeProjectAccount: convertToPublicKey(wallet.publicKey.toString()),
                    token: convertToPublicKey(tokenMintAddress!),
                }).sendAndConfirm(swapUmi);

                toast.success("NFT swapped for tokens successfully");
            } else {
                if (!selectedEscrowAsset) {
                    toast.error("Please Select an asset");
                    throw new Error("No escrow asset selected");
                }

                await captureV1(swapUmi, {
                    owner: swapUmi.identity,
                    escrow: convertToPublicKey(escrowAddress!),
                    asset: convertToPublicKey(selectedEscrowAsset),
                    collection: convertToPublicKey(collectionAddress!),
                    feeProjectAccount: convertToPublicKey(wallet.publicKey.toString()),
                    token: convertToPublicKey(tokenMintAddress!),
                }).sendAndConfirm(swapUmi);

                toast.success("Tokens swapped for NFT successfully");
            }
        } catch (error: any) {
            console.error("Error during swap:", error);
            toast.error(error.message || "Swap failed");
        } finally {
            setIsLoading(false);
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
                if (!escrowAddress) {
                    toast.error("Escrow address not initialized");
                    throw new Error("Escrow address not initialized");
                }

                return !isNftToToken ? (
                    <ReceiveSelector
                        umi={swapUmi}
                        onPrev={() => handleStepChange("prev")}
                        onNext={() => handleFinalStep()}
                        isNftToToken={isNftToToken}
                        collectionAddress={collectionAddress}
                        tokenMintAddress={tokenMintAddress}
                        escrowAddress={escrowAddress}
                        selectedEscrowAsset={selectedEscrowAsset}
                        setSelectedEscrowAsset={setSelectedEscrowAsset}
                    />
                ) : null;
            default:
                return null;
        }
    };

    return (
        <section className='text-white min-h-screen'>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            )}


            {renderStep()}
        </section>
    );
};

export default Swap;