import {
  DasApiAsset,
  DasApiAssetList
} from "@metaplex-foundation/digital-asset-standard-api";
import {
  captureV1,
  releaseV1
} from "@metaplex-foundation/mpl-hybrid";
import {
  PublicKey,
  Umi,
  TransactionBuilder,
  Signer,
  signerIdentity,
  Pda,
  publicKey
} from "@metaplex-foundation/umi";
import {
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import { UserFTokens, UserNFTokens } from "../swap-types";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Types and Interfaces
export enum TradeState {
  nft = "nft",
  tokens = "tokens"
}

interface EscrowData {
  publicKey: Pda;
  collection: PublicKey;
  token: PublicKey;
  feeLocation: PublicKey;
  path: number;
}

interface SwapConfig {
  swapOption: TradeState;
  selectedNft?: UserNFTokens;
  selectedFt: UserFTokens
  escrow: Pda;
  collection: PublicKey;
  feeLocation: PublicKey;

}

interface TransactionSettings {
  commitment?: "processed" | "confirmed" | "finalized";
  skipPreflight?: boolean;
}

interface TransactionResult {
  signature: string[];
  confirmation: {
    signature: Uint8Array;
    blockhash: string;
    slot: number;
  };
}

interface SearchAssetArgs {
  owner: string;
  collection: string;
  burnt: boolean;
}

// Helper function to search assets
async function searchAssets(
  umi: Umi,
  searchAssetArgs: SearchAssetArgs
): Promise<DasApiAssetList | undefined> {
  let page = 1;
  let continueFetch = true;
  let assets: DasApiAssetList | undefined;

  while (continueFetch) {
    // @ts-ignore - RPC method not properly typed in interface
    const response: DasApiAssetList = await umi.rpc.searchAssets({
      owner: searchAssetArgs.owner,
      grouping: ["collection", searchAssetArgs.collection],
      burnt: searchAssetArgs.burnt,
      page,
    });

    console.log(`Page: ${page}, Total assets: `, response.total);
    if (response.total < 1000) {
      console.log("Total assets less than 1000 on current page, stopping loop");
      continueFetch = false;
    }

    if (!assets) {
      assets = response;
      continueFetch = false;
    } else {
      response.total = response.total + assets.total;
      response.items = assets.items.concat(response.items);
    }
    page++;
  }
  return assets;
}

// Helper function to fetch escrow assets
async function fetchEscrowAssets(
  umi: Umi,
  escrowAddress: string,
  collectionId: string
): Promise<DasApiAssetList | undefined> {
  if (!escrowAddress) {
    throw new Error("Escrow address not found");
  }

  if (!collectionId) {
    throw new Error("Collection not found");
  }

  return await searchAssets(umi, {
    owner: escrowAddress,
    collection: collectionId,
    burnt: false,
  });
}

// Helper function to send and confirm transaction
async function sendAndConfirmTransaction(
  umi: Umi,
  tx: TransactionBuilder,
  settings?: TransactionSettings
): Promise<TransactionResult> {
  const blockhash = await umi.rpc.getLatestBlockhash({
    commitment: settings?.commitment || "confirmed",
  });

  const transactions = tx
    .add(setComputeUnitPrice(umi, { microLamports: BigInt(100000) }))
    .setBlockhash(blockhash);

  const signedTx = await transactions.buildAndSign(umi);

  const signature = await umi.rpc
    .sendTransaction(signedTx, {
      preflightCommitment: settings?.commitment || "confirmed",
      commitment: settings?.commitment || "confirmed",
      skipPreflight: settings?.skipPreflight || false,
    })
    .catch((err: Error) => {
      throw new Error(`Transaction failed: ${err.message}`);
    });

  const confirmation = await umi.rpc.confirmTransaction(signature, {
    strategy: { type: "blockhash", ...blockhash },
    commitment: settings?.commitment || "confirmed",
  });

  return {
    signature: base58.deserialize(signature) as string[],
    confirmation,
  };
}

// Main swap function
async function performSwap(
  umi: Umi,
  signer: Signer,
  config: SwapConfig,
  settings?: TransactionSettings
): Promise<TransactionResult> {
  // Setup UMI with signer
  const umiWithSigner = umi.use(signerIdentity(signer));

  if (!config.escrow) {
    throw new Error("No escrow configuration provided");
  }

  switch (config.swapOption) {
    case TradeState.nft: {
      if (!config.selectedNft) {
        throw new Error("No NFT selected");
      }

      const releaseTx = releaseV1(umiWithSigner, {
        owner: umiWithSigner.identity,
        escrow: config.escrow,
        asset: publicKey(config.selectedNft.mintAddress),
        collection: publicKey(config.selectedNft.collectionAddress.address as string),
        token: publicKey(config.selectedFt.mintAddress),
        feeProjectAccount: config.feeLocation,
      });

      return sendAndConfirmTransaction(umiWithSigner, releaseTx, settings);
    }

    // case TradeState.tokens: {
    //   let nft: DasApiAsset | undefined = config.selectedNft;

    //   // Handle reroll path
    //   if (config.escrow.path === 1 && !config.selectedNft) {
    //     const escrowAssets = await fetchEscrowAssets(
    //       umiWithSigner,
    //       config.escrow.publicKey.toString(),
    //       config.escrow.collection.toString()
    //     );

    //     if (!escrowAssets || escrowAssets.total === 0) {
    //       throw new Error("No NFTs available to swap in escrow");
    //     }

    //     nft = escrowAssets.items[0];
    //   }

    //   if (!nft) {
    //     throw new Error("No NFT selected for swap");
    //   }

    //   const captureTx = captureV1(umiWithSigner, {
    //     owner: umiWithSigner.identity,
    //     escrow: config.escrow.publicKey,
    //     asset: nft.id,
    //     collection: config.escrow.collection,
    //     token: config.escrow.token,
    //     feeProjectAccount: config.escrow.feeLocation,
    //   });

    //   return sendAndConfirmTransaction(umiWithSigner, captureTx, settings);
    // }

    default:
      throw new Error("Invalid swap option");
  }
}

export type {
  EscrowData,
  SwapConfig,
  TransactionSettings,
  TransactionResult,
  SearchAssetArgs
};

export {
  searchAssets,
  fetchEscrowAssets
};

export default performSwap;