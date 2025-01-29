// src/components/Swap/utils.ts
import { findAssociatedTokenPda, createTokenIfMissing, transferTokens, } from "@metaplex-foundation/mpl-toolbox"; // Adjust import based on actual package
import { fetchEscrowV1, updateEscrowV1, releaseV1, captureV1, mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1, } from "@metaplex-foundation/mpl-hybrid"; // Adjust import based on actual package
import {
  FundEscrowParams,
  SwapNftToTokensParams,
  SwapTokensToNFTsParams,
  UpdateEscrowConfigParams,
  UserNFTokens,
  UserFTokens,
  CreateEscrowParams,
} from "./swap-types";
import { clusterApiUrl } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner, mplTokenMetadata, } from "@metaplex-foundation/mpl-token-metadata";
import { fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { string, base58, publicKey as publicKeySerializer, } from "@metaplex-foundation/umi/serializers";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import axios from "axios";

// Function that adds zeros to a number, needed for adding the correct amount of decimals
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros);
}
export async function createEscrow({ rpcEndpoint, escrowName, collectionBaseUrl, maxUri = 15, minUri = 0, path = 0, collectionAddress, fTokenAddress, wallet, }: CreateEscrowParams) {
  try {
    const umi = createUmi(rpcEndpoint)
      .use(mplHybrid())
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    console.log(umi.identity.publicKey);
    const signer = umi.identity;
    umi.use(signerIdentity(signer));

    const name = escrowName; // The name of the escrow
    const uri = collectionBaseUrl; // The base URI of the collection
    const max = maxUri; // The max URI
    const min = minUri; // The min URI

    // Escrow Accounts - Change these to your needs
    const collection = publicKey(collectionAddress); // The collection we are swapping to/from
    const token = publicKey(fTokenAddress); // The token we are swapping to/from
    const feeLocation = publicKey(umi.identity.publicKey); // The address where the fees will be sent
    const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
      string({ size: "variable" }).serialize("escrow"),
      publicKeySerializer().serialize(collection),
    ]); // The derived escrow account

    // Get escrow's token account
    const escrowAddressPublicKey = publicKey(escrow);
    console.log(escrowAddressPublicKey, "Escrow address publickey");
    // Get escrow ATA

    // const escrowTokenAccount = findAssociatedTokenPda(umi, {
    //   mint: publicKey(token),
    //   owner: escrowAddressPublicKey
    // });
    // console.log('Gotten escrow public key and token account, about to get token balance from token account', escrowTokenAccount);

    // Token Swap Settings - Change these to your needs
    const tokenDecimals = 6; // The decimals of the token
    const amount = addZeros(100, tokenDecimals); // The amount the user will receive when swapping
    const feeAmount = addZeros(1, tokenDecimals); // The amount the user will pay as fee when swapping to NFT
    const solFeeAmount = addZeros(0, 9); // Additional fee to pay when swapping to NFTs (Sol has 9 decimals)

    /// Step 3: Create the Escrow
    const escrowData = await fetchEscrowV1(umi, escrowAddressPublicKey);
    console.log(escrowData);
    if (!escrowData) {
      const initEscrowTx = await initEscrowV1(umi, {
        name,
        uri,
        max,
        min,
        path,
        escrow,
        collection,
        token,
        feeLocation,
        amount,
        feeAmount,
        solFeeAmount,
      }).sendAndConfirm(umi);
      const escrowConfigurationAddress = escrowAddressPublicKey;
      console.log(
        "Escrow account",
        escrowConfigurationAddress,
        "Escrow",
        escrow
      );
      const signature = base58.deserialize(initEscrowTx.signature)[0];
      console.log(
        `Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } else {
      console.log(escrowAddressPublicKey);
    }

    return escrow;
  } catch (error) {
    console.error(error);
  }
}
// Function to fund the escrow
export async function fundEscrow({
  umi,
  escrowConfigurationAddress,
  tokenMint,
  amount = 100_000_000,
}: FundEscrowParams): Promise<void> {
  try {
    const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
      owner: umi.identity.publicKey,
      mint: tokenMint,
    });

    const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
      owner: escrowConfigurationAddress,
      mint: tokenMint,
    });

    await createTokenIfMissing(umi, {
      mint: tokenMint,
      owner: escrowConfigurationAddress,
      token: escrowTokenAccountPda,
      payer: umi.identity,
    })
      .add(
        transferTokens(umi, {
          source: sourceTokenAccountPda,
          destination: escrowTokenAccountPda,
          amount: amount,
        })
      )
      .sendAndConfirm(umi);

    console.log(`Escrow funded successfully with ${amount} tokens.`);
  } catch (error) {
    console.error("Error funding escrow:", error);
    throw new Error("Failed to fund escrow");
  }
}

// Function to update escrow configuration
export async function updateEscrowConfiguration({
  umi,
  escrowConfigurationAddress,
  newConfig,
}: UpdateEscrowConfigParams): Promise<void> {
  try {
    const escrowConfigurationData = await fetchEscrowV1(
      umi,
      escrowConfigurationAddress
    );

    const res = await updateEscrowV1(umi, {
      ...escrowConfigurationData,
      escrow: escrowConfigurationAddress,
      authority: umi.identity,
      ...newConfig, // Pass any new values you want to update here
    }).sendAndConfirm(umi);

    console.log("Escrow configuration updated successfully:", res);
  } catch (error) {
    console.error("Error updating escrow configuration:", error);
    throw new Error("Failed to update escrow configuration");
  }
}

// Function to swap NFT to tokens
export async function swapNftToFungible({
  umi,
  escrowConfigurationAddress,
  asset,
  collection,
  feeProjectAccount,
  tokenAccount,
}: SwapNftToTokensParams): Promise<void> {
  try {
    const res = await releaseV1(umi, {
      owner: umi.identity,
      escrow: escrowConfigurationAddress,
      asset: asset,
      collection: collection,
      feeProjectAccount: feeProjectAccount,
      token: tokenAccount,
    }).sendAndConfirm(umi);

    console.log("NFT swapped to tokens successfully:", res);
  } catch (error) {
    console.error("Error swapping NFT to tokens:", error);
    throw new Error("Failed to swap NFT to tokens");
  }
}

// Function to swap tokens to NFTs
export async function swapFungibleToNFTs({
  umi,
  escrowConfigurationAddress,
  asset,
  collection,
  feeProjectAccount,
  nftAccount,
}: SwapTokensToNFTsParams): Promise<void> {
  try {
    const res = await captureV1(umi, {
      owner: umi.identity,
      escrow: escrowConfigurationAddress,
      asset: asset,
      collection: collection,
      feeProjectAccount: feeProjectAccount,
      token: nftAccount,
    }).sendAndConfirm(umi);

    console.log("Tokens swapped for NFT successfully:", res);
  } catch (error) {
    console.error("Error swapping tokens to NFT:", error);
    throw new Error("Failed to swap tokens to NFT");
  }
}

// Function to Truncate A Wallet Address
export function truncateAddress(
  address: string,
  startLength = 4,
  endLength = 4
) {
  if (address.length < startLength + endLength) {
    throw new Error("Address is too short to truncate.");
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  return `${start}...${end}`;
}

// Function to fetch all NonFungibletokens for a wallet
export async function getNonFungibleTokensForWallet(
  walletAddress: string,
  rpcEndpoint = clusterApiUrl("devnet")
) {
  try {
    const umi = createUmi(rpcEndpoint);
    const ownerPublicKey = publicKey(walletAddress);
    console.log("Fetching nfts....");
    const allNFTs = await fetchAssetsByOwner(umi, ownerPublicKey);
    return allNFTs;
  } catch (error) {
    console.error("Error swapping tokens to NFT:", error);
    throw new Error("Failed to swap tokens to NFT");
  }
}

// Function to fetch all Fungibletokens for a wallet
export async function getFungibleTokensForWallet(
  walletAddress: string,
  rpcEndpoint = clusterApiUrl("devnet")
) {
  try {
    const umi = createUmi(rpcEndpoint);
    const ownerPublicKey = publicKey(walletAddress);
    console.log("Fetching Fungible Tokens....");
    const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(
      umi,
      ownerPublicKey
    );
    // const nfts: UserFTokens[] = [];
    // allNFTs.forEach((nft) => {
    //   nfts.push({
    //     mintAddress: nft.publicKey,
    //     name: nft.metadata.name,
    //     symbol: nft.metadata.symbol,
    //     uri: nft.metadata.uri,
    //   });
    // });

    // const returnData = {
    //   specificData: nfts,
    //   fullData: allNFTs,
    // };
    // console.log("fts fetched successfully", returnData);
    return allNFTs;
  } catch (error) {
    console.error("Error swapping tokens to NFT:", error);
    throw new Error("Failed to swap tokens to NFT");
  }
}


export const getTokenMetadataImage = async function (url: string) {
  try {
    const response = await axios.get(url)
    console.log(response?.data?.image)
    return response?.data?.image as string
  } catch (error) {
    console.error(error)
  }
}