import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Umi } from "@metaplex-foundation/umi";
import { getNonFungibleTokensForWallet } from "../utils";
import { AssetV1 } from "@metaplex-foundation/mpl-core";

interface ReceiveSelectorProps {
    umi: Umi;
    onPrev: () => void;
    onNext: () => Promise<void>;
    isNftToToken: boolean;
    collectionAddress: string | null;
    tokenMintAddress: string | null;
    escrowAddress: string;
    selectedEscrowAsset: AssetV1 | null;
    setSelectedEscrowAsset: React.Dispatch<React.SetStateAction<AssetV1 | null>>;
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const ReceiveSelector: React.FC<ReceiveSelectorProps> = ({
    onPrev,
    isNftToToken,
    collectionAddress,
    escrowAddress,
    selectedEscrowAsset,
    setSelectedEscrowAsset,
    onNext
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [assets, setAssets] = useState<AssetV1[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAssets = async function () {
            setIsLoading(true);
            setError(null);
            try {
                if (!collectionAddress) {
                    throw new Error("Please input your collection address");
                }
                console.log("Getting Assets....");
                const response = await getNonFungibleTokensForWallet(escrowAddress);
                setAssets(response);
                console.log(response);
            } catch (error: any) {
                console.error("Error fetching assets", error);
                setError(error.message || "Failed to fetch assets");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserAssets();
    }, [collectionAddress, escrowAddress]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                    Choose {isNftToToken ? "Token" : "NFT"} to Receive
                </h2>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="py-8">
                            <LoadingSpinner />
                            <p className="text-center mt-4 text-gray-400">
                                Loading assets...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-4">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Assets will be rendered here */}
                            {assets.length === 0 ? (
                                <p className="text-center text-gray-400">
                                    No assets found
                                </p>
                            ) : (<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {assets?.map((item, index) => {
                                    return (
                                        <div
                                            className={`w-full aspect-[9/10] rounded-md p-2 border cursor-pointer 
                                                ${item.publicKey === selectedEscrowAsset?.publicKey
                                                    ? "border-yellow-400 bg-yellow-400/20"
                                                    : "border-white/50"
                                                }`}
                                            key={item.publicKey}
                                            onClick={() => setSelectedEscrowAsset(assets[index])}
                                        >
                                            <div className="w-full h-[90%] rounded-lg flex items-center justify-center bg-slate-700">
                                                <span className="text-2xl font-bold capitalize">{item.name[0]}</span>
                                            </div>
                                            <div className="text-center">{item.name}</div>
                                        </div>
                                    );
                                })}
                            </div>)}

                        </div>
                    )}

                    <div className="flex justify-between gap-4">
                        <button
                            onClick={onPrev}
                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={onNext}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                        >
                            Confirm Swap
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReceiveSelector;