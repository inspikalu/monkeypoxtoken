import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import {
  createEscrow,
  fundEscrow,
  getFungibleTokensForWallet,
  getNonFungibleTokensForWallet,
  swapNftToFungible,
  truncateAddress,
} from "./utils";
import { UserNFTokens, UserFTokens } from "./swap-types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";
import { mplHybrid } from "@metaplex-foundation/mpl-hybrid";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey as convertToPublicKey } from "@metaplex-foundation/umi";

const Swap = () => {
  const { publicKey, connected } = useWallet();
  const [userFTokens, setUserFTokens] = useState<UserFTokens[]>([]);
  const [userNFTokens, setUserNFTokens] = useState<UserNFTokens[]>([]);
  const [isNftToToken] = useState(true);
  // const [tokensPerNft] = useState(10); // Example value, adjust as needed

  const wallet = useWallet();

  useEffect(() => {
    if (publicKey) {
      getFungibleTokensForWallet(publicKey.toBase58())
        .then((item) => setUserFTokens(item.specificData))
        .catch((error) => toast.error(error.message));

      getNonFungibleTokensForWallet(publicKey.toBase58())
        .then((item) => setUserNFTokens(item.specificData))
        .catch((error) => toast.error(error.message));
    }
  }, [publicKey]);

  const handleSwapNftToToken = async function () {
    if (!userNFTokens[0].collectionAddress.address) {
      return;
    }
    try {
      const umi = createUmi(clusterApiUrl("devnet"))
        .use(mplHybrid())
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));

      console.log(umi.identity.publicKey);
      console.log("Creating escrow");
      const escrowConfigurationAddress = await createEscrow({
        wallet: wallet,
        collectionAddress: userNFTokens[0].collectionAddress.address as string,
        collectionBaseUrl: "https://hello",
        escrowName: "Fake Escrow",
        fTokenAddress: userFTokens[0].mintAddress,
        rpcEndpoint: clusterApiUrl("devnet"),
      });

      if (!escrowConfigurationAddress) {
        throw new Error("No escrow configuration");
      }

      fundEscrow({
        umi,
        escrowConfigurationAddress: convertToPublicKey(
          escrowConfigurationAddress[0]
        ),
        tokenMint: convertToPublicKey(userFTokens[0].mintAddress),
      });
      console.log("Funded Successfully");

      swapNftToFungible({
        umi,
        escrowConfigurationAddress,
        asset: convertToPublicKey(userNFTokens[0].mintAddress),
        collection: convertToPublicKey(
          userNFTokens[0].collectionAddress.address
        ),
        feeProjectAccount: umi.identity.publicKey,
        tokenAccount: convertToPublicKey(userFTokens[0].mintAddress),
      });
      console.log(" escrow Created");
    } catch (error) {
      console.error(error);
    }
  };

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
            {/* <p className="text-gray-400">
              1 $ASTRO = {tokensPerNft.toLocaleString()} $MOONL
            </p> */}
          </div>
          {connected && (
            <div className="text-sm text-gray-400">
              {truncateAddress(publicKey?.toBase58() || "")}
            </div>
          )}
        </div>
        {isNftToToken ? (
          <div>
            <div className="grid items-center grid-cols-[1fr_4fr]">
              {/* <FormField label="Select Amount" /> */}
            </div>
            <label>
              <span>Choose nft</span>
              <select className="flex flex-col w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white">
                {userNFTokens.map((item, idx) => {
                  return (
                    <option key={idx} className="px-4 py-2 bg-gray-800/50">
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <button onClick={handleSwapNftToToken}>Swap</button>
          </div>
        ) : (
          <div></div>
        )}
      </motion.div>
    </div>
  );
};

export default Swap;
