import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  mplHybrid, 
  initEscrowV1,
  fetchEscrowV1,
  MPL_HYBRID_PROGRAM_ID
} from '@metaplex-foundation/mpl-hybrid';
import { 
  createTokenIfMissing,
  transferTokens,
  findAssociatedTokenPda,
  SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
  fetchToken,
  mplToolbox
} from '@metaplex-foundation/mpl-toolbox';
import { web3JsEddsa } from '@metaplex-foundation/umi-eddsa-web3js';
import { publicKey, publicKeyBytes, sol } from '@metaplex-foundation/umi';
import { string, publicKey as publicKeySerializer, } from '@metaplex-foundation/umi/serializers';
import { addCollectionPlugin, mplCore } from '@metaplex-foundation/mpl-core';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

export class EscrowSetupService {
  private static readonly CONFIG = {
    // COLLECTION: '3PE2v9UG1GhWBdAu2wdJU2FFdQKPdjXkxLj46GR2gb87',
    COLLECTION: '3W49jasuVCzLxoAkQ2Wt8TNb5CdqRCMDjKXnDYh8hRSc',
    TOKEN_MINT: '4F9WCp4Dzv9SMf9auVQBbmXH97sVWT28mTzvqiSwgvUR',
    AUTHORITY: 'AopUFgSHXJmcQARjTJex43NYcaQSMcVWmKtcYybo43Xm',
    BASE_URI: 'https://gateway.pinata.cloud/ipfs/QmNSEeQmTXAJQYTKnpFiL9uDtK6svtvjVbzrqSwdy4N4m3',
    MIN_INDEX: 0,
    MAX_INDEX: 9999,
    TOKEN_PER_NFT: 100000,
    TOKEN_FEE: 1000,
    SOL_FEE: 0.1, // 0.1 SOL
    ESCROW_NAME: 'MoonLambo',
    INITIAL_FUNDING_AMOUNT: 1000000 // Amount of tokens to initially fund the escrow
  };

  public umi;
  public escrowAddress;
  public token;

  constructor() {
    this.umi = createUmi('https://api.devnet.solana.com')
      .use(web3JsEddsa())
      .use(mplHybrid())
      .use(mplToolbox())
      .use(mplCore())
      .use(mplTokenMetadata());

    // Calculate escrow PDA
    this.escrowAddress = this.umi.eddsa.findPda(
      MPL_HYBRID_PROGRAM_ID,
      [
        string({ size: 'variable' }).serialize('escrow'),
        publicKeySerializer().serialize(publicKey(EscrowSetupService.CONFIG.COLLECTION)),
      ]
    );

    this.token = publicKey(EscrowSetupService.CONFIG.TOKEN_MINT);

  }

  async initializeEscrow() {
    try {
      console.log('Initializing escrow with Core collection...See address below:');
        console.log(this.escrowAddress)
      // Get fee wallet's token account
      const feeTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        owner: publicKey(EscrowSetupService.CONFIG.AUTHORITY)
      });
      console.log('Gotten fee token account, about to process tx', feeTokenAccount);
      const tx = await initEscrowV1(this.umi, {
        name: EscrowSetupService.CONFIG.ESCROW_NAME,
        uri: EscrowSetupService.CONFIG.BASE_URI,
        escrow: this.escrowAddress,
        collection: publicKey(EscrowSetupService.CONFIG.COLLECTION),
        token: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        feeLocation: publicKey(EscrowSetupService.CONFIG.AUTHORITY),
        feeAta: feeTokenAccount,
        min: EscrowSetupService.CONFIG.MIN_INDEX,
        max: EscrowSetupService.CONFIG.MAX_INDEX,
        amount: EscrowSetupService.CONFIG.TOKEN_PER_NFT,
        feeAmount: EscrowSetupService.CONFIG.TOKEN_FEE,
        solFeeAmount: sol(EscrowSetupService.CONFIG.SOL_FEE).basisPoints,
        path: 0, // Enable metadata rerolling
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
      });
      console.log('Confirming initialize tx next');
      const signature = await tx.sendAndConfirm(this.umi);
      console.log('Escrow initialized successfully:', signature);
      
      return signature;
    } catch (error) {
      console.error('Failed to initialize escrow:', error);
      throw error;
    }
  }

  async fundEscrow() {
    try {
      console.log('Starting escrow funding process...');

      // Get source token account (your wallet's token account)
      const sourceTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        owner: this.umi.identity.publicKey
      });
      console.log('Gotten source token account, about to get escrow public key again', sourceTokenAccount);

      // Get escrow's token account
    const escrowAddressPublicKey = publicKey(this.escrowAddress);

      const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        owner: escrowAddressPublicKey
      });
      console.log('Gotten escrow public key and token account, about to get token balance from token account', escrowTokenAccount);

      // Check source token balance
      const sourceToken = await fetchToken(this.umi, sourceTokenAccount);
      if (Number(sourceToken.amount) < EscrowSetupService.CONFIG.INITIAL_FUNDING_AMOUNT) {
        throw new Error('Insufficient token balance for funding');
      }

      // Create escrow token account if it doesn't exist and transfer tokens
      console.log('Balance is all good, about to process tx');
      const tx = await createTokenIfMissing(this.umi, {
        mint: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        owner: this.escrowAddress,
        token: escrowTokenAccount,
        payer: this.umi.identity,
      }).add(
        transferTokens(this.umi, {
          source: sourceTokenAccount,
          destination: escrowTokenAccount,
          amount: EscrowSetupService.CONFIG.INITIAL_FUNDING_AMOUNT,
        })
      );
      console.log('Confirming fund tx next');

      const signature = await tx.sendAndConfirm(this.umi);
      console.log('Escrow funded successfully:', signature);

      return signature;
    } catch (error) {
      console.error('Failed to fund escrow:', error);
      throw error;
    }
  }

  async addDelegates() {
    try {
      console.log('Adding delegates to collection...');
      
      const delegates = [
        publicKey("5jD4WTmGYmJG6e9JjRvJX8Svk5Ph2rxqwPjrqky33rRg"),
        publicKey("6Ajc185h256k1fVxuWGJCZjUXbFT8SQ17J3LZLRCLbTr"),
        publicKey("2BAnwcKZHzohvMjwZ4ekxN2vmrgLF955d8U1cw1XvHVz")
      ];

      await addCollectionPlugin(this.umi, {
        collection: publicKey(EscrowSetupService.CONFIG.COLLECTION),
        plugin: {
          type: 'UpdateDelegate',
          additionalDelegates: delegates, // Now correctly typed as PublicKey[]
          authority: { 
            type: 'Address', 
            address: publicKey(this.escrowAddress) 
          },
        },
      }).sendAndConfirm(this.umi);
  
      console.log('Successfully added delegates to collection');
    } catch (error) {
      console.error('Failed to add delegates:', error);
      throw error;
    }
  }

  async verifySetup() {
    try {
      console.log('Verifying escrow setup...');
      
      const escrowData = await fetchEscrowV1(this.umi, this.escrowAddress);
      console.log('Escrow data fetched', escrowData);
      
      // Verify escrow configuration
      const isValid = 
        escrowData.collection.toString() === EscrowSetupService.CONFIG.COLLECTION &&
        escrowData.token.toString() === EscrowSetupService.CONFIG.TOKEN_MINT &&
        escrowData.authority.toString() === EscrowSetupService.CONFIG.AUTHORITY &&
        Number(escrowData.amount) === EscrowSetupService.CONFIG.TOKEN_PER_NFT;

      if (!isValid) {
        throw new Error('Escrow configuration validation failed');
      }

      console.log('Escrow configuration is all good');


      // Check escrow token balance
    const escrowAddressPublicKey = publicKey(this.escrowAddress);

      const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(EscrowSetupService.CONFIG.TOKEN_MINT),
        owner: escrowAddressPublicKey
      });

      const tokenBalance = await fetchToken(this.umi, escrowTokenAccount);
      
      console.log('Escrow verification completed:', {
        escrowAddress: this.escrowAddress.toString(),
        tokenBalance: Number(tokenBalance.amount),
        configuration: escrowData
      });

      return true;
    } catch (error) {
      console.error('Escrow verification failed:', error);
      throw error;
    }
  }
}