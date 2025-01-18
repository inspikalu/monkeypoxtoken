import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { clusterUrl } from "./utils/launchpad-types";
import { publicKey } from "@metaplex-foundation/umi";
import type { AssetV1 } from "@metaplex-foundation/mpl-core";

interface NFTMetadata {
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  description?: string;
}

interface NFTAsset {
  id: string;
  metadata: NFTMetadata;
}

const NFTPage = () => {
  const { publicKey: walletPublicKey, wallet } = useWallet();
  const [nfts, setNfts] = useState<NFTAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(clusterUrl.devnet);

  const fetchNFTMetadata = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error(`Error fetching metadata from ${uri}:`, error);
      return null;
    }
  };

  const fetchNFTs = async () => {
    if (!wallet || !walletPublicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

    try {
      setIsLoading(true);

      // Initialize UMI with wallet adapter
      const umi = createUmi(selectedNetwork).use(
        walletAdapterIdentity(wallet.adapter)
      );

      // Fetch all assets owned by the wallet
      const assets = await fetchAssetsByOwner(
        umi,
        publicKey(walletPublicKey.toString())
      );

      // Fetch metadata for each NFT
      const nftPromises = assets.map(async (asset) => {
        // Check the structure of the asset object
        const metadataUri = asset.uri || asset.metadata?.uri; // Access URI correctly
        const metadata = await fetchNFTMetadata(metadataUri);

        return {
          id: asset.publicKey.toString(), // Use publicKey instead of id
          metadata: {
            name: asset.metadata?.name || "Unnamed", // Handle missing metadata fields
            symbol: asset.metadata?.symbol || "",
            uri: asset.metadata?.uri || "",
            image: metadata?.image,
            description: metadata?.description,
          },
        };
      });

      const nftData = await Promise.all(nftPromises);
      setNfts(nftData.filter((nft) => nft !== null));
    } catch (error: any) {
      console.error("Failed to fetch NFTs:", error);
      toast.error(`Failed to fetch NFTs: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletPublicKey) {
      fetchNFTs();
    }
  }, [walletPublicKey, selectedNetwork]);

  if (!walletPublicKey) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl text-gray-400">
          Please connect your wallet to view your NFTs
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-yellow-400">
            Your NFT Collection
          </h1>
          <select
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value as clusterUrl)}
          >
            <option value={clusterUrl.devnet} className="bg-gray-800/95">
              Devnet
            </option>
            <option value={clusterUrl.mainnet} className="bg-gray-800/95">
              Mainnet
            </option>
            <option value={clusterUrl.testnet} className="bg-gray-800/95">
              Testnet
            </option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600" />
                <div className="p-4 space-y-2">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nfts.map((nft, i) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
              >
                <div className="aspect-square bg-gradient-to-br from-yellow-400/20 to-purple-600/20 relative">
                  {nft.metadata.image ? (
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-yellow-400 text-xl">
                        {nft.metadata.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-yellow-400">
                    {nft.metadata.name}
                  </h3>
                  {nft.metadata.description && (
                    <p className="text-gray-400 mt-2">
                      {nft.metadata.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-xl text-gray-400">
              No NFTs found in this wallet on the selected network
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTPage;
