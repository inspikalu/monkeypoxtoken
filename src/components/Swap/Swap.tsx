import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import {
  getFungibleTokensForWallet,
  getNonFungibleTokensForWallet,
  truncateAddress,
} from "./utils";
import { UserNFTokens, UserFTokens } from "./swap-types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowUpDown } from 'lucide-react';
import createUnifiedEscrow from "./utils/createEscrow";
import { clusterApiUrl } from "@solana/web3.js";
import { captureV1, MPL_HYBRID_PROGRAM_ID, mplHybrid, releaseV1 } from "@metaplex-foundation/mpl-hybrid";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey as convertToPublicKey, signerIdentity, } from "@metaplex-foundation/umi";
import { fetchEscrowV1 } from "@metaplex-foundation/mpl-hybrid";
import {
  publicKey as publicKeySerializer,
  string,
} from "@metaplex-foundation/umi/serializers";
import searchAssets from "./utils/searchAssets";


const Swap = () => {
  const { publicKey, connected } = useWallet();
  const [userFTokens, setUserFTokens] = useState<UserFTokens[]>([]);
  const [userNFTokens, setUserNFTokens] = useState<UserNFTokens[]>([]);
  const [isNftToToken, setIsNftToToken] = useState(true);
  const [selectedNft, setSelectedNft] = useState<UserNFTokens | null>(null);
  const [selectedToken, setSelectedToken] = useState<UserFTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const wallet = useWallet();

  const fetchUserAssets = async function() {
    try {
      if (!publicKey) {
        throw new Error("Please Connect your wallet")
      }
      await Promise.all([
        getFungibleTokensForWallet(publicKey.toBase58())
          .then((item) => setUserFTokens(item.specificData))
          .catch((error) => toast.error(error.message)),

        getNonFungibleTokensForWallet(publicKey.toBase58())
          .then((item) => setUserNFTokens(item.specificData))
          .catch((error) => toast.error(error.message)),
      ])
    } catch (error: any) {
      toast.error("Error fetching userAssets", error.message)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    if (publicKey && connected) {
      fetchUserAssets().finally(() => setIsLoading(false))
    }
  }, [publicKey]);

  const handleSwapDirectionToggle = () => {
    setIsNftToToken(!isNftToToken);
    setSelectedNft(null);
    setSelectedToken(null);
  };



  const handleSwap = async () => {
    const swapUmi = createUmi(clusterApiUrl("devnet"))
      .use(mplHybrid())
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    const validateEscrow = async function() {
      const umiWithSigner = swapUmi.use(signerIdentity(swapUmi.identity));
      try {
        if (!selectedNft?.collectionAddress.address) {
          throw new Error("Select a valid collection address");
        }
        const escrowAddress = umiWithSigner.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
          string({ size: "variable" }).serialize("escrow"),
          publicKeySerializer().serialize(selectedNft?.collectionAddress.address),
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
      if (isNftToToken) {
        if (!selectedNft || !publicKey) {
          throw new Error('Please select an NFT and Connect Wallet');
        }
        if (!selectedNft?.collectionAddress?.address) {
          throw new Error('Selected NFT does not have a valid collection address');
        }
        if (!selectedToken?.mintAddress) {
          throw new Error("Selected Token does not have a valid mint address")
        }
        console.log(selectedNft, "NFT", selectedToken, "Token")
        console.log("________________________________________")
        console.log(selectedNft?.collectionAddress?.address)

        let escrowPublickKey
        const validatedEscrow = await validateEscrow()
        if (validatedEscrow) { escrowPublickKey = validatedEscrow.publicKey }
        console.log(validatedEscrow, "Escrow Validated")
        if (!validatedEscrow) {
          const createEscrow = await createUnifiedEscrow(
            swapUmi,
            swapUmi.identity,
            {
              name: `Moonlambo ${publicKey?.toString().slice(0, 8)}`,
              metadataBaseUrl: "https://base-uri/",
              minIndex: 0,
              maxIndex: 15,
              feeWalletAddress: wallet.publicKey ? wallet.publicKey.toString() : "",
              tokenSwapCost: 1,
              tokenSwapFee: 1,
              solSwapFee: 0.5,
              reroll: true,
              collectionAddress: selectedNft?.collectionAddress.address,
              tokenMintAddress: selectedToken?.mintAddress,
            },
          )
          console.log(createEscrow)
          escrowPublickKey = createEscrow.escrowAddress
        }
        console.log(escrowPublickKey)

        if (!escrowPublickKey) {
          throw new Error("Error Creating Escrow")
        }
        if (!wallet?.publicKey) {
          throw new Error("Connect Wallet")
        }

        await releaseV1(swapUmi, {
          owner: swapUmi.identity,
          escrow: convertToPublicKey(escrowPublickKey),
          asset: convertToPublicKey(selectedNft.mintAddress),
          collection: convertToPublicKey(selectedNft.collectionAddress.address),
          feeProjectAccount: convertToPublicKey(wallet.publicKey.toString()),
          token: convertToPublicKey(selectedToken.mintAddress)
        }).sendAndConfirm(swapUmi)

        toast.success("Token swapped Successfully")

      } else {
        if (!selectedNft || !publicKey) {
          throw new Error('Please select an NFT and Connect Wallet');
        }
        if (!selectedNft?.collectionAddress?.address) {
          throw new Error('Selected NFT does not have a valid collection address');
        }
        if (!selectedToken?.mintAddress) {
          throw new Error("Selected Token does not have a valid mint address")
        }
        console.log(selectedNft, "NFT", selectedToken, "Token")
        console.log("________________________________________")
        console.log(selectedNft?.collectionAddress?.address)

        let escrowPublickKey
        const validatedEscrow = await validateEscrow()
        if (validatedEscrow) { escrowPublickKey = validatedEscrow.publicKey }
        console.log(validatedEscrow, "Escrow Validated")
        if (!validatedEscrow) {
          const createEscrow = await createUnifiedEscrow(
            swapUmi,
            swapUmi.identity,
            {
              name: `Moonlambo ${publicKey?.toString().slice(0, 8)}`,
              metadataBaseUrl: "https://base-uri/",
              minIndex: 0,
              maxIndex: 15,
              feeWalletAddress: wallet.publicKey ? wallet.publicKey.toString() : "",
              tokenSwapCost: 1,
              tokenSwapFee: 1,
              solSwapFee: 0.5,
              reroll: true,
              collectionAddress: selectedNft?.collectionAddress.address,
              tokenMintAddress: selectedToken?.mintAddress,
            },
          )
          console.log(createEscrow)
          escrowPublickKey = createEscrow.escrowAddress
        }
        console.log(escrowPublickKey)

        if (!escrowPublickKey) {
          throw new Error("Error Creating Escrow")
        }
        if (!wallet?.publicKey) {
          throw new Error("Connect Wallet")
        }

        console.log(
          await searchAssets(swapUmi, {
            owner: swapUmi.identity.publicKey.toString(),
            collection: selectedNft.collectionAddress.address,
            burnt: false
          }, selectedNft.collectionAddress.address)
        )

        console.log("Above swap")
        const swapit = await captureV1(swapUmi, {
          owner: swapUmi.identity,
          escrow: convertToPublicKey(escrowPublickKey),
          asset: convertToPublicKey(selectedNft.mintAddress),
          // asset: null,
          collection: convertToPublicKey(selectedNft.collectionAddress.address as string),
          feeProjectAccount: convertToPublicKey(wallet.publicKey.toString()),
          token: convertToPublicKey(selectedToken.mintAddress)
        }).sendAndConfirm(swapUmi)
        console.log("IN swap", swapit)

        // Handle Token to NFT swap
      }
    } catch (err: any) {
      console.error(err)
      toast.error("Escrow is not yet a delegated authority")
      // toast.error(err.message);
    }
  };

  const SelectNFT = () => (
    <label className="block w-full">
      <span className="text-sm text-gray-300 mb-1 block">Choose NFT</span>
      <select
        value={selectedNft?.mintAddress || ""}
        onChange={(e) => {
          const selected = userNFTokens.find(nft => nft.mintAddress === e.target.value);
          setSelectedNft(selected || null);
        }}
        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
      >
        <option value="">{userNFTokens.length > 0 ? "Select an NFT" : "You don't have any NFT"}</option>
        {userNFTokens.map((item, idx) => (
          <option key={idx} value={item.mintAddress} className="bg-gray-800">
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );

  const SelectToken = () => (
    <label className="block w-full">
      <span className="text-sm text-gray-300 mb-1 block">Choose Token</span>
      <select
        value={selectedToken?.mintAddress || ""}
        onChange={(e) => {
          const selected = userFTokens.find(token => token.mintAddress === e.target.value);
          setSelectedToken(selected || null);
        }}
        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
      >
        <option value="">{userFTokens.length > 0 ? "Select a token" : "You don't have any token"}</option>
        {userFTokens.length > 0 && userFTokens.map((item, idx) => (
          <option key={idx} value={item.mintAddress} className="bg-gray-800">
            {item.name} ({item.symbol})
          </option>
        ))}
      </select>
    </label>
  );

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
          <p>Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
          <p>Loading your tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">
              {isNftToToken ? "NFT → Tokens" : "Tokens → NFT"}
            </h2>
          </div>
          <div className="text-sm text-gray-400">
            {truncateAddress(publicKey?.toBase58() || "")}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="relative">
            {/* First Select */}
            <div className="mb-12">
              {isNftToToken ? <SelectNFT /> : <SelectToken />}
            </div>

            {/* Switch Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[30%] z-10">
              <button
                onClick={handleSwapDirectionToggle}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors flex items-center justify-center"
              >
                <ArrowUpDown size={20} className="text-yellow-400" />
              </button>
            </div>

            {/* Second Select */}
            <div className="mt-12">
              {isNftToToken ? <SelectToken /> : <SelectNFT />}
            </div>
          </div>

          <button
            onClick={handleSwap}
            disabled={!selectedToken || !selectedNft}
            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isNftToToken ? "Swap NFT for Tokens" : "Swap Tokens for NFT"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Swap;

