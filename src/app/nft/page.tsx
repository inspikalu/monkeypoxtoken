"use client"

import { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { publicKey } from '@metaplex-foundation/umi';
import { NFTCard } from '@/components/NFTCard';
import { NftPreviewModal } from '@/components/NftPreviewModal';
import { NFTFilters } from '@/components/NFTFilter';
import { NFTSkeleton } from '@/components/NFTSkeleton';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { useUmi } from '@/lib/hooks/useUmi';
import type { NFTMetadata } from '@/types/nft';
import { fetchAsset } from '@metaplex-foundation/mpl-core';

// const NFT_MINTS = [
//   "3nzT4F9kZQr5FaPVVkMu7yzsc9iMKGzhB1pYXwmy5tVH",
//   "7hzmgvHbrJbBeWfF9AoV6Xr4pz95FJ8dc8GsoWz8khaL",
//   "DknC1dabAkxYLnJ1aDSSNmSYaBkNVt7yodKYW8qcejPK",
//   "BMeMddgrbPqAc6g7je56YbT1UvDV2QPC7VndzbWrnwqc",
//   "DukeJAqUsHmF64ibnanRHsdjVooAEnxcHJvMADBLrrSg",
//   "7EDN2RfTwYszuM7MyFcKRDRrt91rEFGVMsqHGSGKwp4o",
//   "HunGCVUevqwgSZNgfqJ8TYYmDig9vE424fbfbPX4GrZt",
//   "9snifkfMDJcT4bwBdMTTHVmtFhjiwy3Jv1Ahz2Jw5mwP",
//   "Bo5cqHUNZh9MgPzeT5FRFThFStD23epkNNNpyYhy7gx1",
//   "CvVHhCx6zKXjmKTHSD4kZeVksB22ffz3u948ttHS87sG"
// ];

const NFT_MINTS = [
  "J7e5vQdcVbk5m65gYTUYvT3ewZBzsG8kgLd9ZbRK3GTh",
  "5btViSvacRmnprZ2z9fgMvcE7CJaX2YX7JvUWtAvQHYv",
  "D1Cnu1dF98cbCrn4uXzh63JCiCNn2537u2VtbaGHZ9Bv",
  "3eyi7dwBD2moq5j3zmmmt1FoeeyfUST8Kt2YYD6trbMB",
  "E6Zvr6GvUikFBi7LUaKzMXXsBzaMeKm4H4uzcm92utVV",
  "8d86zDhXrBU4RNxEzoixQR2HpxPbSxahhxMgUahFiQTj",
  "8yxAU6iFWffQvkEfGQn2qtUPXVa4hy5RXCP5LvikNyjf",
  "2PJzcP4UaYwDdYXRexq57v3xGobKvrtBbtUU6Zm2bJhK",
  "7XL5QC3gap5Bqqabkj4e48e9hxmyrSKRXkxTKsjxssw",
  "6TKuMWgcQWCYryZmyemK7cNF69MrewdqEZfNPykieyKF"
];

const NFTPage = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<NFTMetadata | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { connected } = useWallet();
  const umi = useUmi();

  const loadNFTs = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      // Initialize with loading states
      const initialLoadingStates = NFT_MINTS.map(mint => ({
        mint,
        name: `Loading NFT ${mint.slice(0, 4)}...`,
        isLoading: true,
        isLocked: false,
        description: 'Loading...'
      }));
      setNfts(initialLoadingStates);
      setFilteredNfts(initialLoadingStates);

      const nftMetadata = await Promise.all(
        NFT_MINTS.map(async (mint) => {
          try {
            const mintPubkey = publicKey(mint);

            const asset = await fetchAsset(umi, mintPubkey);
            

            const response = await fetch(asset.uri);
            if (!response.ok) throw new Error('Failed to fetch metadata');
            
            const jsonMetadata = await response.json();
            console.log(`JSON metadata for ${mint}:`, jsonMetadata);
            // Check if NFT is locked (you might want to implement your own logic here)
            const isLocked = false; // Replace with actual lock status check

            return {
              mint,
              name: jsonMetadata.name || `NFT #${mint.slice(0, 4)}`,
              image: jsonMetadata.image,
              description: jsonMetadata.description,
              attributes: jsonMetadata.attributes,
              symbol: jsonMetadata.symbol,
              isLoading: false,
              isLocked
            };
          } catch (error) {
            console.error(`Failed to fetch metadata for ${mint}:`, error);
            return {
              mint,
              name: `NFT #${mint.slice(0, 4)}`,
              description: 'Failed to load metadata',
              isLocked: false,
              isLoading: false,
              error: 'Failed to load NFT'
            };
          }
        })
      );

      setNfts(nftMetadata);
      setFilteredNfts(nftMetadata);
    } catch (error) {
      setError('Failed to load NFTs. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (connected) {
      loadNFTs();
    } else {
      setNfts([]);
      setFilteredNfts([]);
    }
  }, [connected]);

  const handleSearch = (query: string) => {
    const filtered = nfts.filter(nft => 
      nft.name.toLowerCase().includes(query.toLowerCase()) ||
      nft.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNfts(filtered);
  };

  const handleSort = (value: 'name' | 'recent' | 'locked') => {
    const sorted = [...filteredNfts].sort((a, b) => {
      if (value === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (value === 'locked') {
        return (a.isLocked === b.isLocked) ? 0 : a.isLocked ? -1 : 1;
      }
      return 0;
    });
    setFilteredNfts(sorted);
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadNFTs} />;
  }

  const availableNfts = filteredNfts.filter(nft => !nft.isLocked);
  const lockedNfts = filteredNfts.filter(nft => nft.isLocked);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">NFT Collection</h1>
            <p className="text-gray-400 mt-2">
              Available: {availableNfts.length} | Locked: {lockedNfts.length}
            </p>
          </div>
          <button
            onClick={loadNFTs}
            disabled={isRefreshing}
            className="bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'} 
            <FaSync className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        <NFTFilters onSearch={handleSearch} onSort={handleSort} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <NFTSkeleton key={i} />)
          ) : (
            filteredNfts.map((nft, i) => (
              <NFTCard
                key={nft.mint}
                nft={nft}
                index={i}
                onClick={() => !nft.isLocked && setSelectedNft(nft)}
              />
            ))
          )}
        </div>

        {selectedNft && (
          <NftPreviewModal
            nft={selectedNft}
            onClose={() => setSelectedNft(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NFTPage;