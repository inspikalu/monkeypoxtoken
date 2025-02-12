// TokenForm.tsx
import { forwardRef, useState, useImperativeHandle } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { mintTokensTo, createAssociatedToken, findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { FaRocket } from "react-icons/fa6";
import { toast } from "sonner";
import FormField from "./FormField";
import DeploymentResult from "./DeploymentResult";
import { clusterUrl } from "../utils/launchpad-types";
import * as LaunchPadInterface from "../utils/launchpad-types";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

const TokenForm = forwardRef<
  { resetForm: () => void },
  LaunchPadInterface.TokenFormProps
>(({ isLoading, setIsLoading }, ref) => {
  const { publicKey: walletPublicKey, wallet } = useWallet();
  const [deploymentResult, setDeploymentResult] =
    useState<LaunchPadInterface.TokenDeploymentResponse | null>(null);

  const initialFormState: LaunchPadInterface.TokenFormData = {
    name: "",
    symbol: "",
    uri: "",
    decimals: 9,
    initialSupply: 1000,
    publicKey: walletPublicKey?.toString() || "",
    rpcEndpoint: clusterUrl.devnet,
  };

  const [formData, setFormData] =
    useState<LaunchPadInterface.TokenFormData>(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
    setDeploymentResult(null);
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet || !walletPublicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }
    if (!formData.rpcEndpoint) {
      toast.error("Please choose a valid endpoint");
      return;
    }

    try {
      setIsLoading(true);

      // Create UMI instance
      const umi = createUmi(formData.rpcEndpoint).use(mplToolbox());

      // Add wallet adapter identity
      umi.use(walletAdapterIdentity(wallet.adapter));

      // Create new token mint
      const mint = generateSigner(umi);

      // Calculate initial supply with decimals
      const initialAmount = formData.initialSupply * Math.pow(10, formData.decimals);

      // Find the associated token account PDA for the user's wallet
      const associatedTokenAccount = findAssociatedTokenPda(umi, {
        mint: mint.publicKey,
        owner: publicKey(walletPublicKey.toString()),
      });

      let builder = createV1(umi, {
        mint,
        name: formData.name,
        symbol: formData.symbol,
        uri: formData.uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: formData.decimals,
        tokenStandard: TokenStandard.Fungible,
      });

      // Create ATA and mint tokens to it
      if (initialAmount > 0) {
        builder = builder
          .add(
            createAssociatedToken(umi, {
              mint: mint.publicKey,
              owner: publicKey(walletPublicKey.toString()),
            })
          )
          .add(
            mintTokensTo(umi, {
              mint: mint.publicKey,
              token: associatedTokenAccount,
              amount: BigInt(initialAmount),
              mintAuthority: umi.identity,
            })
          );
      }

      // Send transaction
      const result = await builder.sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

      // Set deployment result
      const deploymentResult: LaunchPadInterface.TokenDeploymentResponse = {
        success: true,
        mint: mint.publicKey,
        transaction: result.signature.toString(),
        network: formData.rpcEndpoint as clusterUrl,
        message: "Token Created Successfully",
      };

      setDeploymentResult(deploymentResult);
      toast.success("Token deployed successfully!");
    } catch (error: any) {
      console.error("Token deployment failed:", error);
      toast.error(`Deployment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }

    // try {
    //   setIsLoading(true);

    //   // Create UMI instance
    //   const umi = createUmi(formData.rpcEndpoint).use(mplToolbox());

    //   // Add wallet adapter identity
    //   umi.use(walletAdapterIdentity(wallet.adapter));

    //   // Create new token mint
    //   const mint = generateSigner(umi);

    //   // Calculate initial supply with decimals
    //   const initialAmount =
    //     formData.initialSupply * Math.pow(10, formData.decimals);

    //   // First create the token account
    //   const tokenAccount = generateSigner(umi);

    //   let builder = createV1(umi, {
    //     mint,
    //     name: formData.name,
    //     symbol: formData.symbol,
    //     uri: formData.uri,
    //     sellerFeeBasisPoints: percentAmount(0),
    //     decimals: formData.decimals,
    //     tokenStandard: TokenStandard.Fungible,
    //   });

    //   // Create token account before minting
    //   if (initialAmount > 0) {
    //     builder = builder
    //       .add(
    //         createToken(umi, {
    //           mint: mint.publicKey,
    //           owner: publicKey(walletPublicKey.toString()),
    //           token: tokenAccount,
    //         })
    //       )
    //       .add(
    //         mintTokensTo(umi, {
    //           mint: mint.publicKey,
    //           token: tokenAccount.publicKey,
    //           amount: BigInt(initialAmount),
    //           mintAuthority: umi.identity,
    //         })
    //       );
    //   }

    //   // Send transaction
    //   const result = await builder.sendAndConfirm(umi, {
    //     confirm: { commitment: "finalized" },
    //   });

    //   // Set deployment result
    //   const deploymentResult: LaunchPadInterface.TokenDeploymentResponse = {
    //     success: true,
    //     mint: mint.publicKey,
    //     transaction: result.signature.toString(),
    //     network: formData.rpcEndpoint as clusterUrl,
    //     message: "Token Created Successfully",
    //   };

    //   setDeploymentResult(deploymentResult);
    //   toast.success("Token deployed successfully!");
    // } catch (error: any) {
    //   console.error("Token deployment failed:", error);
    //   toast.error(`Deployment failed: ${error.message}`);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleSelectNetwork = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndpoint = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rpcEndpoint: newEndpoint,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Token Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter token name"
        />
        <FormField
          label="Token Symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleInputChange}
          required
          placeholder="Enter token symbol"
          maxLength={10}
        />
        <FormField
          label="Metadata URI"
          name="uri"
          value={formData.uri}
          onChange={handleInputChange}
          required
          placeholder="Enter metadata URI"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Decimals"
            name="decimals"
            type="number"
            value={formData.decimals}
            onChange={handleInputChange}
            required
            min={0}
            max={9}
          />
          <FormField
            label="Initial Supply"
            name="initialSupply"
            type="number"
            value={formData.initialSupply}
            onChange={handleInputChange}
            required
            min={1}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Select Network
          </label>
          <select
            name="rpcEndpoint"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
            value={formData.rpcEndpoint}
            onChange={handleSelectNetwork}
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
          {isLoading ? "Deploying..." : "Deploy Token"}
          <FaRocket className={isLoading ? "animate-spin" : ""} />
        </button>
      </form>

      {deploymentResult && (
        <DeploymentResult
          result={deploymentResult}
          onClose={() => {
            setDeploymentResult(null);
            setFormData(initialFormState);
          }}
        />
      )}
    </>
  );
});

TokenForm.displayName = "TokenForm";
export default TokenForm;
