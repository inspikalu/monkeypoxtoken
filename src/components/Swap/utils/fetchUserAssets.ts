// import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
// import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
// import {
//     createUmi,
// } from "@metaplex-foundation/umi-bundle-defaults";
// import { createSignerFromWalletAdapter, walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
// import { WalletAdapter } from "@solana/wallet-adapter-base";
// import {
//     DasApiAssetList
// } from "@metaplex-foundation/digital-asset-standard-api";
// import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
// import { PublicKey, Umi } from "@metaplex-foundation/umi";

// const fetchUserAssets = async (wallet: WalletContextState, rpcEndpoint: string) => {
//     const umi = createUmi(rpcEndpoint)
//         .use(mplTokenMetadata())
//         .use(walletAdapterIdentity(wallet)).use(dasApi())
//         ;
//     // Initialize Umi instance
//     // const umi = createUmi(rpcEndpoint)
//     //     .use(
//     //         signerIdentity(
//     //             createNoopSigner(publicKey("11111111111111111111111111111111"))
//     //         )
//     //     )
//     //     .use(dasApi())
//     //     .use(mplTokenMetadata());

//     // Create signer from wallet adapter
//     // const signer = createSignerFromWalletAdapter(walletAdapter);
//     const signer = umi.identity

//     const collectionId = process.env.NEXT_PUBLIC_COLLECTION;

//     if (!collectionId) {
//         throw new Error("Collection not found");
//     }

//     let page = 1;
//     let continueFetch = true;
//     let assets: DasApiAssetList | undefined;

//     while (continueFetch) {
//         //@ts-ignore
//         const response: DasApiAssetList = await umi.rpc.searchAssets({
//             owner: signer.publicKey,
//             grouping: ["collection", collectionId],
//             burnt: false,
//             page,
//         });

//         console.log(`Page: ${page}, Total assets: `, response.total);
//         if (response.total < 1000) {
//             console.log("Total assets less than 1000 on current page, stopping loop");
//             continueFetch = false;
//         }

//         if (!assets) {
//             assets = response;
//             continueFetch = false;
//         } else {
//             response.total = response.total + assets.total;
//             response.items = assets.items.concat(response.items);
//         }
//         page++;
//     }

//     return assets;
// };

// async function fetchUserAssets(umi: Umi, assetId: PublicKey) {
//     umi.use(dasApi())
//     try {
//         const asset = await umi.rpc.getAsset(assetId);
//         console.log(asset);
//     } catch (e) {
//         console.error(e);
//     }
// }

// export default fetchUserAssets;
