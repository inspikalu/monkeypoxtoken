import { forwardRef, useState, useImperativeHandle } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCore, create, fetchCollection, ruleSet } from "@metaplex-foundation/mpl-core";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { toast } from "sonner";
import FormField from "./FormField";
import { FaRocket } from "react-icons/fa6";
import * as LaunchPadInterface from "../utils/launchpad-types";
import { clusterUrl } from "../utils/launchpad-types";
import DeploymentResult from "./DeploymentResult";

const NFTForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.NFTFormProps
>(({ }, ref) => {
  const { publicKey: walletPublicKey, wallet } = useWallet();
  const [deploymentResult, setDeploymentResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getInitialFormState = (): LaunchPadInterface.NFTFormData => ({
    rpcEndpoint: clusterUrl.devnet,
    collectionMint: "",
    metadata: {
      name: "",
      uri: "",
      sellerFeeBasisPoints: 500, // 5%
    },
    recipient: walletPublicKey?.toString() || "",
  });

  const [formData, setFormData] = useState<LaunchPadInterface.NFTFormData>(
    getInitialFormState()
  );

  const resetForm = () => {
    setFormData(getInitialFormState());
    setDeploymentResult(null);
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !walletPublicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }
    if (!formData.metadata.sellerFeeBasisPoints) {
      throw new Error("Seller Fee basis point now ");
    }

    try {
      setIsLoading(true);

      // Initialize UMI with wallet adapter
      const umi = createUmi(formData.rpcEndpoint).use(mplCore());
      umi.use(walletAdapterIdentity(wallet.adapter));

      // Convert collection mint to UMI format
      const umiCollectionMint = publicKey(formData.collectionMint);

      // Fetch the existing collection
      const collection = await fetchCollection(umi, umiCollectionMint);

      // Generate a new signer for the NFT
      const assetSigner = generateSigner(umi);

      // Create the NFT in the collection
      const tx = await create(umi, {
        asset: assetSigner,
        collection: collection,
        name: formData.metadata.name,
        uri: formData.metadata.uri,
        owner: formData.recipient
          ? publicKey(formData.recipient)
          : publicKey(walletPublicKey.toString()),
        plugins: [
          {
            type: "Royalties",
            basisPoints: formData.metadata.sellerFeeBasisPoints,
            creators: [
              {
                address: publicKey(walletPublicKey.toString()),
                percentage: 100,
              },
            ],
            ruleSet: ruleSet("None"), // Add this line
          },
        ],
      }).sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

      // Set deployment result
      const result = {
        success: true,
        mint: assetSigner.publicKey,
        metadata: assetSigner.publicKey,
        transaction: tx.signature.toString(),
        network: formData.rpcEndpoint as clusterUrl,
        message: "NFT Minted Successfully",
      };

      setDeploymentResult(result);
      // onSubmit?.(result);
      toast.success("NFT minted successfully!");
    } catch (error: any) {
      console.error("NFT minting failed:", error);
      toast.error(`Minting failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Collection Mint Address"
        name="collectionMint"
        value={formData.collectionMint}
        onChange={(e) =>
          setFormData({ ...formData, collectionMint: e.target.value })
        }
        required
        placeholder="Enter collection address"
      />
      <FormField
        label="NFT Name"
        name="name"
        value={formData.metadata.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            metadata: { ...formData.metadata, name: e.target.value },
          })
        }
        required
        placeholder="Enter NFT name"
      />
      <FormField
        label="Metadata URI"
        name="uri"
        value={formData.metadata.uri}
        onChange={(e) =>
          setFormData({
            ...formData,
            metadata: { ...formData.metadata, uri: e.target.value },
          })
        }
        required
        placeholder="Enter metadata URI"
      />
      <FormField
        label="Royalty Basis Points (100 = 1%)"
        name="sellerFeeBasisPoints"
        type="number"
        value={formData.metadata.sellerFeeBasisPoints}
        onChange={(e) =>
          setFormData({
            ...formData,
            metadata: {
              ...formData.metadata,
              sellerFeeBasisPoints: parseInt(e.target.value),
            },
          })
        }
        required
        min={0}
        max={10000}
      />
      <FormField
        label="Recipient Address (Optional)"
        name="recipient"
        value={formData.recipient}
        onChange={(e) =>
          setFormData({ ...formData, recipient: e.target.value })
        }
        placeholder="Enter recipient address (defaults to connected wallet)"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Select Network
        </label>
        <select
          name="rpcEndpoint"
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
          value={formData.rpcEndpoint}
          onChange={(e) =>
            setFormData({ ...formData, rpcEndpoint: e.target.value })
          }
          required
        >
          <option value="" className="bg-gray-800/95">
            Select your endpoint
          </option>
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

      <button
        type="submit"
        disabled={isLoading || !walletPublicKey}
        className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? "Minting..." : "Mint NFT"}
        <FaRocket className={isLoading ? "animate-spin" : ""} />
      </button>

      {deploymentResult && (
        <DeploymentResult
          result={deploymentResult}
          onClose={() => setDeploymentResult(null)}
        />
      )}
    </form>
  );
});

NFTForm.displayName = "NFTForm";
export default NFTForm;
