// lib/services/SwapService.ts
import { 
  releaseV1, 
  captureV1, 
  fetchEscrowV1 
} from '@metaplex-foundation/mpl-hybrid';
import { 
  fetchToken, 
  findAssociatedTokenPda,
  createTokenIfMissing
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';
import { EscrowSetupService } from './SetupService';
import { toast } from 'react-hot-toast';
import { fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core';


export interface SwapError extends Error {
  code?: string;
  details?: any;
}

export class SwapService {
  // Store addresses as strings to avoid PublicKey type conflicts
  private escrowSetupService: EscrowSetupService;
  private static TOKEN_MINT = '4F9WCp4Dzv9SMf9auVQBbmXH97sVWT28mTzvqiSwgvUR';
  private static TOKEN_ACCOUNT = '8hXxfQgEobh3p8PqK3u9cR2GcHCosZm8t6Gb8qSSRiS3';
  private static AUTHORITY = 'AopUFgSHXJmcQARjTJex43NYcaQSMcVWmKtcYybo43Xm';
  // private static COLLECTION = '3PE2v9UG1GhWBdAu2wdJU2FFdQKPdjXkxLj46GR2gb87';
  private static COLLECTION = '9mKksxtbVMcRdpfe9ZJBuuQqShywNfvdyYSkpXSxLms9';

  private static TOKEN_PER_NFT = 100000;
  
  // List of NFTs available for swapping
  // private static NFT_MINTS = [
  //   "3nzT4F9kZQr5FaPVVkMu7yzsc9iMKGzhB1pYXwmy5tVH",
  //   "7hzmgvHbrJbBeWfF9AoV6Xr4pz95FJ8dc8GsoWz8khaL",
  //   "DknC1dabAkxYLnJ1aDSSNmSYaBkNVt7yodKYW8qcejPK",
  //   "BMeMddgrbPqAc6g7je56YbT1UvDV2QPC7VndzbWrnwqc",
  //   "DukeJAqUsHmF64ibnanRHsdjVooAEnxcHJvMADBLrrSg",
  //   "7EDN2RfTwYszuM7MyFcKRDRrt91rEFGVMsqHGSGKwp4o",
  //   "HunGCVUevqwgSZNgfqJ8TYYmDig9vE424fbfbPX4GrZt",
  //   "9snifkfMDJcT4bwBdMTTHVmtFhjiwy3Jv1Ahz2Jw5mwP",
  //   "Bo5cqHUNZh9MgPzeT5FRFThFStD23epkNNNpyYhy7gx1",
  //   "CvVHhCx6zKXjmKTHSD4kZeVksB22ffz3u948ttHS87sG"
  // ];

  private static NFT_MINTS = [
  "J7e5vQdcVbk5m65gYTUYvT3ewZBzsG8kgLd9ZbRK3GTh",
  "5btViSvacRmnprZ2z9fgMvcE7CJaX2YX7JvUWtAvQHYv",
  "D1Cnu1dF98cbCrn4uXzh63JCiCNn2537u2VtbaGHZ9Bv",
  "3eyi7dwBD2moq5j3zmmmt1FoeeyfUST8Kt2YYD6trbMB",
  "E6Zvr6GvUikFBi7LUaKzMXXsBzaMeKm4H4uzcm92utVV",
  "8d86zDhXrBU4RNxEzoixQR2HpxPbSxahhxMgUahFiQTj",
  "8yxAU6iFWffQvkEfGQn2qtUPXVa4hy5RXCP5LvikNyjf",
  "2PJzcP4UaYwDdYXRexq57v3xGobKvrtBbtUU6Zm2bJhK",
  "7XL5QC3gap5Bqqabkj4e48e9hxmyrSKRXkxTKsjxssw",
  "6TKuMWgcQWCYryZmyemK7cNF69MrewdqEZfNPykieyKF"
];
  public umi;

  constructor() {
    this.escrowSetupService = new EscrowSetupService();
    this.umi = this.escrowSetupService.umi;
    // this.umi = createUmi('https://api.devnet.solana.com')
    //   .use(web3JsEddsa())
    //   .use(mplHybrid());
  }

  async setupAndValidateEscrow() {
    try {
      console.log('Starting escrow setup and validation...');

      // Initialize escrow if needed
      const escrowData = await this.validateEscrow().catch(async () => {
        console.log('Escrow not found, initializing new escrow...');
        await this.escrowSetupService.initializeEscrow();
        await this.escrowSetupService.fundEscrow();
        return await this.validateEscrow();
      });

      console.log('Escrow setup and validation completed:', {
        escrowAddress: this.escrowSetupService.escrowAddress.toString(),
        configuration: {
          collection: escrowData.collection.toString(),
          token: escrowData.token.toString(),
          authority: escrowData.authority.toString(),
          tokenPerNft: Number(escrowData.amount),
          name: escrowData.name,
          uri: escrowData.uri
        }
      });

      return escrowData;
    } catch (error) {
      console.error('Escrow setup and validation failed:', error);
      throw this.handleError(error);
    }
  }

  private async validateEscrow() {
    try {
      console.log('Validating escrow configuration...');
      
      const escrowData = await fetchEscrowV1(
        this.umi,
        this.escrowSetupService.escrowAddress
      );

      if (!escrowData) {
        throw new Error('Escrow data not found');
      }

      // Additional validation
      if (
        escrowData.collection.toString() !== SwapService.COLLECTION ||
        escrowData.token.toString() !== SwapService.TOKEN_MINT ||
        escrowData.authority.toString() !== SwapService.AUTHORITY ||
        Number(escrowData.amount) !== SwapService.TOKEN_PER_NFT
      ) {
        throw new Error('Escrow configuration mismatch');
      }

      console.log('Escrow validation successful:', {
        escrowAddress: this.escrowSetupService.escrowAddress.toString(),
        tokenBalance: await this.getEscrowTokenBalance()
      });

      return escrowData;
    } catch (error) {
      console.error('Escrow validation failed:', error);
      throw error;
    }
  }

  private async getEscrowTokenBalance(): Promise<number> {
    const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
      mint: publicKey(SwapService.TOKEN_MINT),
      owner: publicKey(this.escrowSetupService.escrowAddress)
    });

    const token = await fetchToken(this.umi, escrowTokenAccount);
    return Number(token.amount);
  }

  async swapNftForTokens(nftMint: string) {
    try {
      // Validate NFT mint is from our collection
      if (!SwapService.NFT_MINTS.includes(nftMint)) {
        const error: SwapError = new Error('Invalid NFT mint address');
        error.code = 'INVALID_NFT_MINT';
        throw error;
      }
      await this.verifyCollection();
      await this.setupAndValidateEscrow();

      // Get token account for the wallet
    // Get and create token account for the wallet if it doesn't exist
    const walletTokenAccount = findAssociatedTokenPda(this.umi, {
      mint: publicKey(SwapService.TOKEN_MINT),
      owner: this.umi.identity.publicKey
    });

    console.log('Creating token account if needed...');
    const createTokenAccountTx = await createTokenIfMissing(this.umi, {
      mint: publicKey(SwapService.TOKEN_MINT),
      owner: this.umi.identity.publicKey,
      token: walletTokenAccount,
    });

    // Wait for token account creation to be confirmed
    if (createTokenAccountTx.items.length > 0) {
      await createTokenAccountTx.sendAndConfirm(this.umi);
    }

    // Verify the token account exists and fetch its data
    console.log('Verifying token account...');
    const tokenAccount = await fetchToken(this.umi, walletTokenAccount);
    console.log('Token account data:', tokenAccount);

    // Get escrow data to verify configuration
    console.log('Fetching escrow data...');
    const escrowData = await fetchEscrowV1(this.umi, this.escrowSetupService.escrowAddress);
    console.log('Escrow data:', escrowData);

    console.log('Executing release transaction with params:', {
      owner: this.umi.identity.publicKey.toString(),
      escrow: this.escrowSetupService.escrowAddress.toString(),
      asset: nftMint,
      collection: SwapService.COLLECTION,
      feeProjectAccount: SwapService.AUTHORITY,
      token: walletTokenAccount.toString()
    });
      // Execute the NFT to tokens swap
      const tx = await releaseV1(this.umi, {
        owner: this.umi.identity,
        // escrow: publicKey(this.escrowSetupService.escrowAddress),
        escrow: publicKey("2BAnwcKZHzohvMjwZ4ekxN2vmrgLF955d8U1cw1XvHVz"),
        asset: publicKey(nftMint),
        collection: publicKey(SwapService.COLLECTION),
        feeProjectAccount: publicKey(SwapService.AUTHORITY),
        // token: publicKey(walletTokenAccount),
        token: publicKey("8hXxfQgEobh3p8PqK3u9cR2GcHCosZm8t6Gb8qSSRiS3"),
      });

      return await tx.sendAndConfirm(this.umi);
    } catch (error) {
      console.error('NFT to tokens swap failed:', error);
      throw this.handleError(error);
    }
  }

  async swapTokensForNft(nftMint: string) {
    try {
      await this.setupAndValidateEscrow();

      const walletTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(SwapService.TOKEN_MINT),
        owner: this.umi.identity.publicKey
      });

      const tx = await captureV1(this.umi, {
        owner: this.umi.identity,
        escrow: this.escrowSetupService.escrowAddress,
        asset: publicKey(nftMint),
        collection: publicKey(SwapService.COLLECTION),
        feeProjectAccount: publicKey(SwapService.AUTHORITY),
        token: walletTokenAccount,
      });

      return await tx.sendAndConfirm(this.umi);
    } catch (error) {
      console.error('Tokens to NFT swap failed:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): SwapError {
    const swapError: SwapError = new Error(error.message || 'Swap failed');
    swapError.code = error.code || 'UNKNOWN_ERROR';
    swapError.details = error;
    return swapError;
  }

  async getAvailableNftMints() {
    return SwapService.NFT_MINTS;
  }

  async getTokenBalance(): Promise<number> {
    try {
      const tokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(SwapService.TOKEN_MINT),
        owner: this.umi.identity.publicKey
      });
  
      try {
        const token = await fetchToken(this.umi, tokenAccount);
        return Number(token.amount);
      } catch (error: any) {
        // If account doesn't exist, return 0 balance
        if (error.name === 'AccountNotFoundError') {
          const noAccountError: SwapError = new Error('No token account found');
          noAccountError.code = 'NO_TOKEN_ACCOUNT';
          throw noAccountError;
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return 0;
    }
  }

  async verifyAsset(nftMint: string) {
    try {
      // Verify the asset exists and belongs to the collection
      const asset = await fetchAsset(this.umi, publicKey(nftMint));
      
      // Check if the asset belongs to our collection
      // if (!asset.collection || asset.collection.toString() !== SwapService.COLLECTION) {
      //   throw new Error('Asset does not belong to the correct collection');
      // }

      return true;
    } catch (error) {
      console.error('Asset verification failed:', error);
      throw this.handleError(error);
    }
  }

  async verifyCollection() {
    try {
      console.log('Verifying Core collection...');
      const collection = publicKey(SwapService.COLLECTION);
      
      // Fetch collection data using Core's method
      const collectionData = await fetchCollection(this.umi, collection);
      console.log('Collection data:', collectionData);

      // Verify collection authority
      const isValid = collectionData.updateAuthority.toString() === SwapService.AUTHORITY;

      if (!isValid) {
        throw new Error('Collection authority mismatch');
      }

      return {
        isValid: true,
        details: {
          name: collectionData.name,
          uri: collectionData.uri,
          updateAuthority: collectionData.updateAuthority.toString(),
        }
      };
    } catch (error) {
      console.error('Collection verification failed:', error);
      return {
        isValid: false,
        error: error
      };
    }
  }

  async validateTokenAmount(amount: number): Promise<boolean> {
    if (amount % SwapService.TOKEN_PER_NFT !== 0) {
      const error: SwapError = new Error(`Amount must be a multiple of ${SwapService.TOKEN_PER_NFT} tokens`);
      error.code = 'INVALID_AMOUNT';
      throw error;
    }
    return true;
  }

  getTokensPerNft(): number {
    return SwapService.TOKEN_PER_NFT;
  }
}