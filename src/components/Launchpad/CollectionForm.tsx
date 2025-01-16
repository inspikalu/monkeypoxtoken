import * as LaunchPadInterface from "../utils/launchpad-types"
import { clusterUrl } from "../utils/launchpad-types";
import { forwardRef, useState, useImperativeHandle } from "react";
import FormField from "./FormField";
import { FaRocket } from "react-icons/fa6";


const CollectionForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.CollectionFormProps
>(({ onSubmit, isLoading }, ref) => {
  const initialFormState: LaunchPadInterface.CollectionFormData = {
    name: "",
    uri: "",
    privateKey: "",
    royaltyBasisPoints: 500,
    rpcEndpoint: typeof clusterUrl,
    creators: [{ address: "", percentage: 100 }],
  };

  const [formData, setFormData] =
    useState<LaunchPadInterface.CollectionFormData>(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  // Expose resetForm to parent component
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
        label="Collection Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormField
        label="Metadata URI"
        value={formData.uri}
        onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
        required
      />
      <FormField
        label="Royalty Basis Points (100 = 1%)"
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
      <FormField
        label="Creator Address"
        value={formData.creators[0].address}
        onChange={(e) =>
          setFormData({
            ...formData,
            creators: [{ ...formData.creators[0], address: e.target.value }],
          })
        }
        required
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
        {isLoading ? "Deploying..." : "Deploy Collection"}{" "}
        <FaRocket className={isLoading ? "animate-spin" : ""} />
      </button>
    </form>
  );
});


export default CollectionForm;