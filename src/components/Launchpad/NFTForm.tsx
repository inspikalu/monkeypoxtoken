import * as LaunchPadInterface from "../utils/launchpad-types";
import { clusterUrl } from "../utils/launchpad-types";
import { forwardRef, useState, useImperativeHandle } from "react";
import FormField from "./FormField";
import { FaRocket } from "react-icons/fa6";

const NFTForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.NFTFormProps
>(({ onSubmit, isLoading }, ref) => {
  const initialFormState: LaunchPadInterface.NFTFormData = {
    rpcEndpoint: typeof clusterUrl,
    privateKey: "",
    collectionMint: "",
    metadata: {
      name: "",
      uri: "",
      sellerFeeBasisPoints: 500, // 5%
    },
    recipient: "",
  };

  const [formData, setFormData] =
    useState<LaunchPadInterface.NFTFormData>(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Collection Mint Address"
        value={formData.collectionMint}
        onChange={(e) =>
          setFormData({ ...formData, collectionMint: e.target.value })
        }
        required
      />
      <FormField
        label="NFT Name"
        value={formData.metadata.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            metadata: { ...formData.metadata, name: e.target.value },
          })
        }
        required
      />
      <FormField
        label="Metadata URI"
        value={formData.metadata.uri}
        onChange={(e) =>
          setFormData({
            ...formData,
            metadata: { ...formData.metadata, uri: e.target.value },
          })
        }
        required
      />
      <FormField
        label="Royalty Basis Points (100 = 1%)"
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
        value={formData.recipient || ""}
        onChange={(e) =>
          setFormData({ ...formData, recipient: e.target.value })
        }
      />
      <FormField
        label="Private Key (Base64)"
        type="password"
        value={formData.privateKey}
        onChange={(e) =>
          setFormData({ ...formData, privateKey: e.target.value })
        }
        required
      />
      <select
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
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? "Minting..." : "Mint NFT"}{" "}
        <FaRocket className={isLoading ? "animate-spin" : ""} />
      </button>
    </form>
  );
});

export default NFTForm;
