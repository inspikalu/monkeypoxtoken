import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, Nft } from '@metaplex-foundation/js';
import { toast } from "sonner";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import fetchAssetByCollection from "../utils/fetchAssetByCollection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplHybrid } from "@metaplex-foundation/mpl-hybrid";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";



interface ReceiveSelectorProps {
    onPrev: () => void;
    isNftToToken: boolean;
    collectionAddress: string | null;
    tokenMintAddress: string | null;
}


const ReceiveSelector: React.FC<ReceiveSelectorProps> = ({ onPrev, isNftToToken, collectionAddress }) => {
    const wallet = useWallet()
    const swapUmi = createUmi(clusterApiUrl("devnet"))
        .use(mplHybrid())
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));
    useEffect(() => {
        try {
            if (!collectionAddress) throw new Error("Please input your collection address")
            console.log("Getting Assets....")
            fetchAssetByCollection({ umi: swapUmi, collectionAddress })
        } catch (error: any) {
            console.error("Error fetching assets", error)
        }
    }, [])
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
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={onPrev}
                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-medium transition-colors"
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