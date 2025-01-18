//src/components/Launchpad/Launchpad.tsx
import { useState, useRef } from "react";
import { FaCoins, FaImages, FaImage } from "react-icons/fa";
import { toast } from "sonner";
import * as LaunchPadInterface from "../utils/launchpad-types";
import {
  createToken,
  createCollection,
  mintNFT,
} from "../utils/collection-apis";
import { SonnerStyle } from "../utils/consts";
import { useDeploymentProgress } from "@/lib/hooks/useDeploymentProgress";
import TokenForm from "./TokenForm";
import CollectionForm from "./CollectionForm";
import NFTForm from "./NFTForm";
import TabButton from "./TabButton";
import DeploymentResult from "./DeploymentResult";

const Launchpad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"token" | "collection" | "nft">(
    "token"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deploymentResult, setDeploymentResult] = useState<
    | LaunchPadInterface.TokenDeploymentResponse
    | LaunchPadInterface.CollectionDeploymentResponse
    | null
  >(null);

  const { connect, disconnect } = useDeploymentProgress();
  const formRef = useRef<{ resetForm: () => void } | null>(null);
  const collectionFormRef = useRef<{ resetForm: () => void } | null>(null);
  const nftFormRef = useRef<{ resetForm: () => void } | null>(null);

  const handleTokenDeploy = async (
    formData: LaunchPadInterface.TokenFormData,
    setIsLoading: (value: React.SetStateAction<boolean>) => void
  ): Promise<void> => {
    try {
      // createToken function already includes setIsLoading internally
      const { data } = await createToken(formData, setIsLoading);

      // Connect to SSE with the clientId returned from createToken
      // connect(clientId);

      if (data.success) {
        setDeploymentResult(data);
        formRef.current?.resetForm();
        toast.success("Token Created Successfully", {
          position: "top-right",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: SonnerStyle,
        });
      } else {
        toast.error("Failed to deploy token", {
          style: SonnerStyle,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionDeploy = async (
    formData: LaunchPadInterface.CollectionFormData
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, clientId } = await createCollection(formData);

      // Connect to SSE with the clientId returned from createCollection
      connect(clientId);

      if (data.collectionAddress) {
        setDeploymentResult(data);
        collectionFormRef.current?.resetForm();
        toast.success("Collection Created Successfully", {
          style: SonnerStyle,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: SonnerStyle,
        });
      } else {
        toast.error("Failed to deploy collection", {
          style: SonnerStyle,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFTMint = async (
    formData: LaunchPadInterface.NFTFormData
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, clientId } = await mintNFT(formData);

      connect(clientId);

      if (data.mint) {
        // setDeploymentResult({
        //   success: true,
        //   mint: data.mint,
        //   message: "NFT minted successfully",
        // });
        nftFormRef.current?.resetForm();
        toast.success("NFT Minted Successfully", {
          style: SonnerStyle,
        });
      } else {
        throw new Error(data.error || "Failed to mint NFT");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: SonnerStyle,
        });
      } else {
        toast.error("Failed to mint NFT", {
          style: SonnerStyle,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-black">
      {/* <LaunchpadProgress isVisible={isLoading} progress={progress} /> */}

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
            Launch Your Project
          </h1>
          <p className="text-gray-400">
            Deploy tokens and NFT collections on Solana with ease
          </p>
        </div>

        <div className="bg-gray-900/30 backdrop-blur rounded-xl p-6">
          <div className="flex gap-2 mb-6">
            <TabButton
              active={activeTab === "token"}
              onClick={() => setActiveTab("token")}
            >
              <FaCoins /> Token
            </TabButton>
            <TabButton
              active={activeTab === "collection"}
              onClick={() => setActiveTab("collection")}
            >
              <FaImages /> Collection
            </TabButton>
            <TabButton
              active={activeTab === "nft"}
              onClick={() => setActiveTab("nft")}
            >
              <FaImage /> Mint NFT
            </TabButton>
          </div>

          {activeTab === "token" && (
            <TokenForm
              ref={formRef}
              onSubmit={handleTokenDeploy}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          {activeTab === "collection" && (
            <CollectionForm
              ref={collectionFormRef}
              onSubmit={handleCollectionDeploy}
              isLoading={isLoading}
            />
          )}
          {activeTab === "nft" && (
            <NFTForm
              ref={nftFormRef}
              onSubmit={handleNFTMint}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {deploymentResult && (
        <DeploymentResult
          result={deploymentResult}
          onClose={() => {
            setDeploymentResult(null);
            disconnect();
          }}
        />
      )}
    </div>
  );
};

export default Launchpad;
