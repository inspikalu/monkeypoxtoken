// src/components/Swap/swap-types.ts
import { UpdateAuthority } from "@metaplex-foundation/mpl-core";
import { Umi, PublicKey, Pda } from "@metaplex-foundation/umi";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface UpdateEscrowConfig {
  name?: string;
  uri?: string;
  max?: number;
  min?: number;
  amount?: number;
  feeAmount?: number;
  solFeeAmount?: number;
  path?: number;
  token?: PublicKey;
  feeLocation?: PublicKey;
  feeAta?: PublicKey;
}

export interface FundEscrowParams {
  umi: Umi;
  escrowConfigurationAddress: PublicKey;
  tokenMint: PublicKey;
  amount?: number;
}

export interface UpdateEscrowConfigParams {
  umi: Umi;
  escrowConfigurationAddress: PublicKey;
  newConfig: UpdateEscrowConfig;
}

export interface SwapNftToTokensParams {
  umi: Umi;
  escrowConfigurationAddress: Pda;
  asset: PublicKey;
  collection: PublicKey;
  feeProjectAccount: PublicKey;
  tokenAccount: PublicKey;
}
export interface CreateEscrowParams {
  wallet: WalletContextState;
  rpcEndpoint: string;
  escrowName: string;
  collectionBaseUrl: string;
  maxUri?: number;
  minUri?: number;
  path?: number;
  collectionAddress: string;
  fTokenAddress: string;
}

export interface SwapTokensToNFTsParams {
  umi: Umi;
  escrowConfigurationAddress: PublicKey;
  asset: PublicKey;
  collection: PublicKey;
  feeProjectAccount: PublicKey;
  nftAccount: PublicKey;
}

export interface UserNFTokens {
  mintAddress: string;
  name: string;
  uri: string;
  collectionAddress: UpdateAuthority;
}

export interface UserFTokens {
  mintAddress: string;
  name: string;
  symbol: string;
  uri: string;
}
