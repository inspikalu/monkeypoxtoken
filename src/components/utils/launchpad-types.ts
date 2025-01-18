//src/components/utils/launchpad-types.ts
import { SetStateAction } from "react";

// Add SSE related types
export type DeploymentType = "token" | "collection" | "nft";
export type DeploymentStatus = "started" | "progress" | "completed" | "error";

export interface DeploymentProgress {
  type: DeploymentType;
  status: DeploymentStatus;
  step?: string;
  progress?: number;
  message?: string;
  error?: string;
}

// API Response Interfaces
export interface TokenDeploymentResponse {
  success: boolean;
  transaction: string; // Added to handle the returned transaction
  mint: string;
  message: string;
  network: clusterUrl
}

export interface CollectionDeploymentResponse {
  collectionAddress: string;
  signature: string;
  error?: string;
}

// Form Data Interfaces
export interface TokenFormData {
  name: string;
  uri: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  publicKey: string;  // Changed from privateKey to publicKey
  rpcEndpoint?: string;
  clientId?: string;
}
export interface Creator {
  address: string;
  percentage: number;
}

export interface CollectionFormData {
  name: string;
  uri: string;
  // privateKey: string;
  royaltyBasisPoints: number;
  creators: Creator[];
  rpcEndpoint: string;
  clientId?: string; // Add clientId for SSE
}

// Component Props Interfaces
export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface TokenFormProps {
  onSubmit: (
    data: TokenFormData,
    setIsLoading: (value: SetStateAction<boolean>) => void
  ) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (value: SetStateAction<boolean>) => void;
}

export interface CollectionFormProps {
  onSubmit: (data: CollectionFormData) => Promise<void>;
  isLoading: boolean;
}

export interface DeploymentResultProps {
  result: TokenDeploymentResponse | CollectionDeploymentResponse;
  onClose: () => void;
}

export interface DeploymentProgressProps {
  isVisible: boolean;
  progress: DeploymentProgress | null;
}

export enum clusterUrl {
  devnet = "https://api.devnet.solana.com",
  mainnet = "https://api.mainnet-beta.solana.com",
  testnet = "https://api.testnet.solana.com",
}

// Add to launchpad-types.ts

export interface NFTMetadata {
  name: string;
  uri: string;
  sellerFeeBasisPoints?: number;
  creators?: Array<{
    address: string;
    share: number;
  }>;
}

export interface NFTFormData {
  rpcEndpoint: string;
  collectionMint: string;
  metadata: NFTMetadata;
  recipient?: string;
  clientId?: string;
}

export interface NFTMintResponse {
  mint: string;
  metadata: string;
}

export interface NFTFormProps {
  onSubmit: (data: NFTFormData) => Promise<void>;
  isLoading: boolean;
}
