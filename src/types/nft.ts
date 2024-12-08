export interface NFTMetadata {
    mint: string;
    name: string;
    image?: string;
    description?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
    symbol?: string;
    isLoading?: boolean;
    isLocked: boolean;
    error?: string;
  }