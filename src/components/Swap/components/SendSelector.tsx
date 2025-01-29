import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { clusterApiUrl } from '@solana/web3.js';
import { useWallet } from "@solana/wallet-adapter-react";
import fetchAssetByCollection from "../utils/fetchAssetByCollection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplHybrid } from "@metaplex-foundation/mpl-hybrid";
import { DigitalAssetWithToken, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { AssetV1 } from "@metaplex-foundation/mpl-core";
import { getFungibleTokensForWallet, getNonFungibleTokensForWallet } from "../utils"
import { publicKey } from "@metaplex-foundation/umi";

interface SendSelectorProps {
    onNext: () => void;
    onPrev: () => void;
    isNftToToken: boolean;
    collectionAddress: string | null;
    tokenMintAddress: string | null;
    selectedNft: AssetV1 | null;
    setSelectedNft: (nft: AssetV1 | null) => void;
    selectedToken?: DigitalAssetWithToken | null;
    setSelectedToken?: (token: DigitalAssetWithToken | null) => void;
}

const SendSelector: React.FC<SendSelectorProps> = ({
    onNext,
    onPrev,
    isNftToToken,
    collectionAddress,
    tokenMintAddress,
    selectedNft,
    setSelectedNft,
    selectedToken,
    setSelectedToken
}) => {
    const wallet = useWallet();
    const swapUmi = createUmi(clusterApiUrl("devnet"))
        .use(mplHybrid())
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));
    const [userNFTAssets, setUserNFTAssets] = useState<AssetV1[] | undefined>(undefined)
    const [userTokens, setUserTokens] = useState<DigitalAssetWithToken[] | undefined>(undefined)
    const [isLoadingAssets, setIsloadingAssets] = useState(false)

    const fetchAssets = async () => {
        try {
            if (isNftToToken && !collectionAddress) {
                throw new Error("Please input your collection address");
            }
            if (!isNftToToken && !tokenMintAddress) {
                throw new Error("Please input your token mint address");
            }
            if (!wallet.publicKey) throw new Error("Please Connect your wallet")

            console.log("Getting Assets....");
            if (isNftToToken && collectionAddress) {
                const allAssetsInWallet = await getNonFungibleTokensForWallet(publicKey(wallet.publicKey))
                const filteredAssets = allAssetsInWallet.filter(asset => asset.updateAuthority.address === collectionAddress);
                setUserNFTAssets(filteredAssets)
            } else {
                if (!wallet.publicKey) throw new Error("Wallet public key is null");
                const response = await getFungibleTokensForWallet(wallet.publicKey.toString());
                setUserTokens(response);
            }
        } catch (error: any) {
            console.error("Error fetching assets", error);
        }
    };

    useEffect(() => {
        setIsloadingAssets(true)


        fetchAssets().finally(() => setIsloadingAssets(false));
    }, [collectionAddress, tokenMintAddress, isNftToToken]);

    const handleNextOrConfirm = () => {
        if (isNftToToken && !selectedNft) {
            // Show error message that no NFT is selected
            return;
        }
        if (!isNftToToken && !selectedToken) {
            // Show error message that no token is selected
            return;
        }
        onNext();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                    Choose {isNftToToken ? "NFT" : "Token"} to Send
                </h2>

                {/* Asset Display Section */}
                <div className="mb-6">
                    {/* Add grid or list of available assets to send */}
                    <div className="bg-gray-700/50 rounded-lg p-4 min-h-40">
                        {/* Asset list will go here */}
                        {isLoadingAssets ? (
                            <p className="text-center text-gray-400">
                                Loading available {isNftToToken ? "NFTs" : "tokens"}...
                            </p>
                        ) : isNftToToken ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {(userNFTAssets && userNFTAssets?.length > 0) ? (<div>{userNFTAssets?.map((item, index) => {
                                    return (
                                        <div
                                            className={`w-full aspect-[9/10] rounded-md p-2 border cursor-pointer ${item.publicKey === selectedNft?.publicKey
                                                ? "border-yellow-400 bg-yellow-400/20"
                                                : "border-white/50"
                                                }`}
                                            key={item.publicKey}
                                            onClick={() => setSelectedNft(userNFTAssets[index])}
                                        >
                                            <div className="w-full h-[90%] rounded-lg flex items-center justify-center bg-slate-700">
                                                <span className="text-2xl font-bold capitalize">{item.name[0]}</span>
                                            </div>
                                            <div className="text-center">{item.name}</div>
                                        </div>
                                    );
                                })}</div>) : (<div className="col-span-3">No asset found</div>)}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(userTokens && userTokens?.length > 0) ? <div>
                                    {userTokens?.map((token, index) => (
                                        <div
                                            key={`${token.mint.publicKey}${index}`}
                                            className={`w-full p-3 rounded-lg cursor-pointer ${token.mint.publicKey === selectedToken?.mint.publicKey
                                                ? "bg-yellow-400/20 border-yellow-400"
                                                : "bg-gray-600/50 border-transparent"
                                                } border hover:bg-gray-500/50 transition-colors`}
                                            onClick={() => setSelectedToken && setSelectedToken(userTokens[index])}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                                                        <span className="text-sm font-bold">{token.metadata?.symbol?.[0] || "T"}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{token.metadata.name || "Unknown Token"}</p>
                                                        <p className="text-sm text-gray-400">{token.metadata.symbol || "TOKEN"}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                    {token.token.amount} {token.metadata?.symbol || "TOK"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div> : <div>No Token Found</div>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={onPrev}
                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextOrConfirm}
                            disabled={isNftToToken ? !selectedNft : !selectedToken}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${(isNftToToken ? selectedNft : selectedToken)
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-yellow-500/50 cursor-not-allowed"
                                }`}
                        >
                            {isNftToToken ? "Confirm Swap" : "Next"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SendSelector;