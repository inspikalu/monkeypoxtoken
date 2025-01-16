//src/components/Launchpad/TokenForm.tsx
import { forwardRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useImperativeHandle } from "react";
import FormField from "./FormField";
import { clusterUrl } from "../utils/launchpad-types";
import * as LaunchPadInterface from "../utils/launchpad-types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createToken } from "../utils/collection-apis";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { Connection } from "@solana/web3.js";
import { SonnerStyle } from "../utils/consts";
import { FaRocket } from "react-icons/fa6";


const TokenForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.TokenFormProps
>(({ onSubmit, isLoading, setIsLoading }, ref) => {
  const { publicKey, wallet } = useWallet();

  const initialFormState: LaunchPadInterface.TokenFormData = {
    name: "",
    symbol: "",
    uri: "",
    decimals: 9,
    initialSupply: 1000,
    publicKey: publicKey?.toString() || "",
    rpcEndpoint: clusterUrl.devnet,
  };

  const [formData, setFormData] =
    useState<LaunchPadInterface.TokenFormData>(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !wallet?.adapter) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!formData.rpcEndpoint) {
      toast.error("Please select an rpc endpoint");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create UMI instance with wallet adapter
      const umi = createUmi(formData.rpcEndpoint)
        .use(walletAdapterIdentity(wallet.adapter))
        .use(mplToolbox());

      // Generate a unique client ID
      const clientId = uuidv4();

      // Send request to create token
      const { data } = await createToken(
        {
          ...formData,
          publicKey: publicKey.toString(),
          clientId,
        },
        setIsLoading
      );

      console.log("Complete response from backend:", data);

      if (data.success && data.transaction) {
        try {
          // Convert base64 to Uint8Array
          const transactionBytes = Buffer.from(data.transaction, "base64");

          // Get latest blockhash
          const latestBlockhash = await umi.rpc.getLatestBlockhash();

          // Deserialize the transaction using the correct method
          const deserializedTx = umi.transactions.deserialize(transactionBytes);
          
          // Update blockhash
          const updatedTx = {
            ...deserializedTx,
            message: {
              ...deserializedTx.message,
              blockhash: latestBlockhash.blockhash,
            }
          };

          console.log("Updated transaction:", updatedTx);

          try {
            // Send transaction directly (UMI will handle signing)
            const signature = await umi.rpc.sendTransaction(updatedTx);

            console.log("Transaction signature:", signature);

            // Wait for confirmation
            const confirmation = await umi.rpc.confirmTransaction(signature, {
              strategy: {
                type: "blockhash",
                ...latestBlockhash,
              },
            });

            console.log("Transaction confirmed:", confirmation);
            
            if (confirmation.value.err) {
              throw new Error("Transaction failed: " + confirmation.value.err);
            }

            toast.success("Token created successfully!");
            onSubmit(formData, setIsLoading);
            
          } catch (sendError: any) {
            console.log("Send error:", sendError);
            
            // Try to get detailed error information
            if (sendError.logs) {
              console.log("Error logs:", sendError.logs);
            }
            
            throw sendError;
          }
        } catch (txError: any) {
          console.log("Transaction error details:", txError);
          
          let errorMessage = "Transaction failed";
          if (txError.message?.includes("blockhash")) {
            errorMessage = "Transaction expired. Please try again.";
          } else if (txError.logs) {
            errorMessage = `Transaction failed: ${txError.logs.join("\n")}`;
          } else if (txError.message) {
            errorMessage = txError.message;
          }

          toast.error(errorMessage, {
            style: SonnerStyle,
            duration: 5000,
          });
        }
      } else {
        throw new Error(data.message || "Failed to prepare transaction");
      }
    } catch (error) {
      console.log("Error creating token:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create token",
        { style: SonnerStyle }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields remain the same */}
      <FormField
        label="Token Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <FormField
        label="Token Symbol"
        value={formData.symbol}
        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
        required
      />
      <FormField
        label="Metadata URI"
        value={formData.uri}
        onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Decimals"
          type="number"
          value={formData.decimals}
          onChange={(e) =>
            setFormData({ ...formData, decimals: parseInt(e.target.value) })
          }
          required
          min={0}
          max={9}
        />
        <FormField
          label="Initial Supply"
          type="number"
          value={formData.initialSupply}
          onChange={(e) =>
            setFormData({
              ...formData,
              initialSupply: parseInt(e.target.value),
            })
          }
          required
          min={1}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Select Network
        </label>
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
      </div>
      <button
        type="submit"
        disabled={isLoading || !publicKey}
        className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? "Deploying..." : "Deploy Token"}
        <FaRocket className={isLoading ? "animate-spin" : ""} />
      </button>
    </form>
  );
});

export default TokenForm;
