// lib/hooks/useSwap.ts
import { useEffect, useState } from 'react';
import { SwapService } from '../services/SwapService';
import { toast } from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { signerIdentity, publicKey as web3publicKey } from '@metaplex-foundation/umi';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAsset } from '@metaplex-foundation/mpl-core';

{/**
interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}
 */}
export interface NftMetadata {
  mint: string;
  name: string;
  image?: string;
  isLocked: boolean;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export const useSwap = () => {
  const { wallet, connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [availableNftMints, setAvailableNftMints] = useState<NftMetadata[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [swapService] = useState(() => new SwapService());

  useEffect(() => {
    if (connected && wallet && publicKey) {
      const signer = createSignerFromWalletAdapter(wallet.adapter);
      swapService.umi.use(signerIdentity(signer));
      loadTokenBalance();
      loadAvailableNftMints();
    } else {
      setTokenBalance(0);
      setAvailableNftMints([]);
    }
  }, [connected, wallet, publicKey]);

  const loadTokenBalance = async () => {
    if (!connected || !publicKey) return;

    setIsBalanceLoading(true);
    try {
      const balance = await swapService.getTokenBalance();
      setTokenBalance(balance);
      return balance;
    } catch (error: any) {
      console.error('Failed to load token balance:', error);
      if (error.code === 'NO_TOKEN_ACCOUNT') {
        setTokenBalance(0);
        toast(error.message, {
          icon: '💡',
          duration: 12000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            border: '1px solid #4A5568'
          },
        });
      } else {
        toast.error('Failed to load token balance');
      }
      return 0;
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const loadAvailableNftMints = async () => {
    if (!connected) return;

    setIsMetadataLoading(true);
    try {
      const mints = await swapService.getAvailableNftMints();
      console.log('Available mints:', mints);

      const nftMetadata = await Promise.all(
        mints.map(async (mint) => {
          try {
            const mintPubkey = web3publicKey(mint);
            // Use Core's fetchAsset instead of fetchMetadataFromSeeds
            const asset = await fetchAsset(swapService.umi, mintPubkey);
            console.log(`Fetched Core asset for ${mint}:`, asset);

            try {
              const response = await fetch(asset.uri);
              if (!response.ok) throw new Error('Failed to fetch metadata JSON');

              const jsonMetadata = await response.json();
              console.log(`JSON metadata for ${mint}:`, jsonMetadata);

              return {
                mint,
                name: jsonMetadata.name || asset.name || `NFT #${mint.slice(0, 4)}`,
                image: jsonMetadata.image,
                isLocked: false, // You might want to check asset ownership or other Core-specific states
                description: jsonMetadata.description,
                attributes: jsonMetadata.attributes
              };
            } catch (jsonError) {
              console.warn(`Failed to fetch JSON metadata for ${mint}:`, jsonError);
              return {
                mint,
                name: asset.name || `NFT #${mint.slice(0, 4)}`,
                isLocked: false,
                description: undefined
              };
            }
          } catch (error) {
            console.error(`Failed to fetch Core asset data for mint ${mint}:`, error);
            return {
              mint,
              name: `NFT #${mint.slice(0, 4)}`,
              isLocked: false
            };
          }
        })
      );

      console.log('Final processed Core NFT metadata:', nftMetadata);
      setAvailableNftMints(nftMetadata);
    } catch (error) {
      console.error('Failed to load Core NFT mints:', error);
      toast.error('Failed to load NFTs');
    } finally {
      setIsMetadataLoading(false);
    }
  };

  const handleNftToTokenSwap = async (nftMint: string) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await swapService.swapNftForTokens(nftMint);
      toast.success('Successfully swapped NFT for tokens!');

      // Refresh balances and mints
      await Promise.all([
        loadTokenBalance(),
        loadAvailableNftMints()
      ]);

      return tx;
    } catch (error) {
      console.error('NFT to tokens swap failed:', error);
      toast.error('Swap failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenToNftSwap = async (nftMint: string) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await swapService.swapTokensForNft(nftMint);
      toast.success('Successfully swapped tokens for NFT!');

      // Refresh balances and mints
      await Promise.all([
        loadTokenBalance(),
        loadAvailableNftMints()
      ]);

      return tx;
    } catch (error) {
      console.error('Tokens to NFT swap failed:', error);
      toast.error('Swap failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isBalanceLoading,
    isMetadataLoading,
    availableNftMints,
    tokenBalance,
    handleNftToTokenSwap,
    handleTokenToNftSwap,
    refreshBalances: loadTokenBalance,
    refreshNfts: loadAvailableNftMints,
    tokensPerNft: swapService.getTokensPerNft()
  };
};