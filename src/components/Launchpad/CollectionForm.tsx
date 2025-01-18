import { forwardRef, useState, useImperativeHandle } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  mplCore,
  createCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { toast } from "sonner";
import FormField from "./FormField";
import { FaRocket } from "react-icons/fa6";
import * as LaunchPadInterface from "../utils/launchpad-types";
import { clusterUrl } from "../utils/launchpad-types";
import DeploymentResult from "./DeploymentResult";

function calculateTotalPercentage(
  creators: { address: string; percentage: number }[]
): number {
  if (!creators || !Array.isArray(creators)) {
    throw new Error("Invalid input: creators must be an array.");
  }

  return creators.reduce((total, creator) => {
    if (typeof creator.percentage !== "number" || creator.percentage < 0) {
      throw new Error(
        `Invalid percentage value for creator: ${creator.address}`
      );
    }
    return total + creator.percentage;
  }, 0);
}

const getInitialFormState = (
  walletAddress?: string
): LaunchPadInterface.CollectionFormData => ({
  name: "",
  uri: "",
  royaltyBasisPoints: 500,
  rpcEndpoint: clusterUrl.devnet,
  creators: [{ address: walletAddress || "", percentage: 100 }],
});

const CollectionForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.CollectionFormProps
>(({}, ref) => {
  const { publicKey: walletPublicKey, wallet } = useWallet();
  const [deploymentResult, setDeploymentResult] = useState<any | null>(null);

  const [formData, setFormData] =
    useState<LaunchPadInterface.CollectionFormData>(
      getInitialFormState(walletPublicKey?.toString())
    );
  const [isLoading, setIsLoading] = useState<boolean>();

  const resetForm = () => {
    setFormData(getInitialFormState(walletPublicKey?.toString()));
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

    try {
      setIsLoading(true);

      // Initialize UMI with wallet adapter
      const umi = createUmi(formData.rpcEndpoint).use(mplCore());
      umi.use(walletAdapterIdentity(wallet.adapter));

      // Generate collection mint signer
      const collectionSigner = generateSigner(umi);

      if (calculateTotalPercentage(formData.creators) !== 100) {
        throw new Error("Total Percentage must be 100%");
      }
      // Format creators array
      const formattedCreators = formData.creators.map((creator) => ({
        address: publicKey(creator.address),
        percentage: creator.percentage,
      }));

      // Create collection
      const tx = await createCollection(umi, {
        collection: collectionSigner,
        name: formData.name,
        uri: formData.uri,
        plugins: [
          {
            type: "Royalties",
            basisPoints: formData.royaltyBasisPoints,
            creators: formattedCreators,
            ruleSet: ruleSet("None"),
          },
        ],
      }).sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

      // Set deployment result
      const result: LaunchPadInterface.CollectionDeploymentResponse = {
        collectionAddress: collectionSigner.publicKey,
        signature: tx.signature.toString(),
      };

      setDeploymentResult(result);
      // onSubmit?.(result);
      toast.success("Collection deployed successfully!");
    } catch (error: any) {
      console.error("Collection deployment failed:", error);
      toast.error(`Deployment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatorChange = (
    index: number,
    field: "address" | "percentage",
    value: string
  ) => {
    const newCreators = [...formData.creators];
    newCreators[index] = {
      ...newCreators[index],
      [field]: field === "percentage" ? parseInt(value) : value,
    };
    setFormData({ ...formData, creators: newCreators });
  };

  const addCreator = () => {
    if (formData.creators.length < 5) {
      setFormData({
        ...formData,
        creators: [...formData.creators, { address: "", percentage: 0 }],
      });
    }
  };

  const removeCreator = (index: number) => {
    if (formData.creators.length > 1) {
      const newCreators = formData.creators.filter((_, i) => i !== index);
      setFormData({ ...formData, creators: newCreators });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Collection Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Enter collection name"
      />
      <FormField
        label="Metadata URI"
        name="uri"
        value={formData.uri}
        onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
        required
        placeholder="Enter metadata URI"
      />
      <FormField
        label="Royalty Basis Points (100 = 1%)"
        name="royaltyBasisPoints"
        type="number"
        value={formData.royaltyBasisPoints}
        onChange={(e) =>
          setFormData({
            ...formData,
            royaltyBasisPoints: parseInt(e.target.value),
          })
        }
        required
        min={0}
        max={10000}
      />

      <div className="space-y-4">
        <label className="block text-2xl font-bold text-gray-300">
          Creators
        </label>
        {formData.creators.map((creator, index) => (
          <div
            key={index}
            className="grid grid-cols-[4fr_1fr_1fr] gap-4 w-full"
          >
            <FormField
              label={`Creator ${index + 1} Address`}
              type="text"
              value={creator.address}
              onChange={(e) =>
                handleCreatorChange(index, "address", e.target.value)
              }
              required
            />
            <FormField
              label="Percentage"
              type="number"
              value={creator.percentage}
              onChange={(e) =>
                handleCreatorChange(index, "percentage", e.target.value)
              }
              required
              min={0}
              max={100}
            />

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeCreator(index)}
                className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {formData.creators.length < 5 && (
          <button
            type="button"
            onClick={addCreator}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Add Creator
          </button>
        )}
      </div>

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
        {isLoading ? "Deploying..." : "Deploy Collection"}
        <FaRocket className={isLoading ? "animate-spin" : ""} />
      </button>

      {deploymentResult && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Deployment Result</h3>
          <p>
            Collection Address: {deploymentResult.collectionAddress.toString()}
          </p>
          <p>Transaction: {deploymentResult.transaction}</p>
        </div>
      )}
      {deploymentResult && (
        <DeploymentResult
          onClose={() => {
            resetForm();
            setDeploymentResult(null);
          }}
          result={deploymentResult}
        />
      )}
    </form>
  );
});

CollectionForm.displayName = "CollectionForm";
export default CollectionForm;
