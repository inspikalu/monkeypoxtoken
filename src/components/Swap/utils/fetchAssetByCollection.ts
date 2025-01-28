import { fetchAssetsByCollection } from "@metaplex-foundation/mpl-core";
import { publicKey, Umi } from "@metaplex-foundation/umi";

interface FetchAssetByCollectionProps {
    umi: Umi,
    collectionAddress: string
}

export default async function fetchAssetByCollection({ umi, collectionAddress }: FetchAssetByCollectionProps) {
    try {

        const response = await fetchAssetsByCollection(umi, publicKey(collectionAddress))
        return response

    } catch (error) {
        console.error("Error Fetching Assets: ", error)
    }
}