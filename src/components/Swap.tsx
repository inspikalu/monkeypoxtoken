// components/SwapPage.tsx
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowsRotate, FaDiamond, FaCoins, FaSpinner, FaEye } from 'react-icons/fa6'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { truncateAddress } from '@/components/utils'
import { toast } from 'react-hot-toast'
import { useSwap } from '@/lib/hooks/useSwap'
import { NftPreviewModal } from '@/components/NftPreviewModal'
import type { NftMetadata } from '@/lib/hooks/useSwap'
import { FaInfoCircle } from 'react-icons/fa'
import SwapSuccessModal from '@/components/SwapSuccessModal'

const createLoadingToast = () => {
  return toast.loading('Processing transaction...', {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

const updateToastSuccess = (toastId: string, message: string) => {
  toast.success(message, {
    id: toastId,
    duration: 5000,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

const updateToastError = (toastId: string, error: any) => {
  toast.error(
    error.message || 'Transaction failed. Please try again.',
    {
      id: toastId,
      duration: 5000,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    }
  );
};

const SwapPage = () => {
  const { publicKey, connected } = useWallet()
  const [nftAmount, setNftAmount] = useState<string>('1')
  const [tokenAmount, setTokenAmount] = useState<string>('100000')
  const [selectedNftMint, setSelectedNftMint] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedNft, setSelectedNft] = useState<NftMetadata | null>(null)
  const [isNftToToken, setIsNftToToken] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { 
    isLoading, 
    isBalanceLoading,
    isMetadataLoading, 
    availableNftMints, 
    tokenBalance, 
    handleNftToTokenSwap, 
    handleTokenToNftSwap,
    tokensPerNft 
  } = useSwap()

  useEffect(() => {
    if (!connected) {
      setNftAmount('1')
      setTokenAmount(tokensPerNft.toString())
      setSelectedNftMint('')
      setSelectedNft(null)
    }
  }, [connected, tokensPerNft])

  useEffect(() => {
    console.log('Preview States:', {
      showPreview,
      selectedNft,
      selectedNftMint,
      availableNftMints
    });
  }, [showPreview, selectedNft, selectedNftMint, availableNftMints]);

  const toggleSwapDirection = () => {
    setIsNftToToken(!isNftToToken)
    // Reset selection when direction changes
    setSelectedNftMint('')
    setSelectedNft(null)
  }

  const handleNftAmountChange = (value: string) => {
    const numValue = Number(value)
    if (numValue >= 0) {
      setNftAmount(value)
      setTokenAmount((numValue * tokensPerNft).toString())
    }
  }

  const handleTokenAmountChange = (value: string) => {
    const numValue = Number(value)
    if (numValue >= 0 && numValue % tokensPerNft === 0) {
      setTokenAmount(value)
      setNftAmount((numValue / tokensPerNft).toString())
    }
  }

  const handleNftSelect = (mint: string) => {
    console.log('handleNftSelect called with mint:', mint);
    setSelectedNftMint(mint);
    const nft = availableNftMints.find(n => n.mint === mint);
    console.log('Found NFT:', nft);
    if (nft) setSelectedNft(nft);
  }

  const handleSwap = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }
  
    const numTokenAmount = Number(tokenAmount)
    if (numTokenAmount % tokensPerNft !== 0) {
      toast.error(`Amount must be a multiple of ${tokensPerNft} tokens`)
      return
    }
  
    const toastId = createLoadingToast();
  
    try {
      if (isNftToToken) {  // <-- Use this instead
        if (!selectedNftMint) {
          updateToastError(toastId, new Error('Please select an NFT to swap'));
          return;
        }
        
        const selectedNft = availableNftMints.find(nft => nft.mint === selectedNftMint)
        if (selectedNft?.isLocked) {
          updateToastError(toastId, new Error('Selected NFT is currently locked'));
          return;
        }
        
        const tx = await handleNftToTokenSwap(selectedNftMint)
        updateToastSuccess(toastId, 'Successfully swapped NFT for tokens!');
        setShowSuccessModal(true);
        setTimeout(() => {
          setNftAmount('1')
          setTokenAmount(tokensPerNft.toString())
          setSelectedNftMint('')
          setSelectedNft(null)
        }, 500);
      } else {
        if (numTokenAmount > tokenBalance) {
          updateToastError(toastId, new Error('Insufficient token balance'));
          return;
        }
        
        const availableNft = availableNftMints.find(nft => !nft.isLocked)
        if (!availableNft) {
          updateToastError(toastId, new Error('No NFTs available for swap'));
          return;
        }
        
        const tx = await handleTokenToNftSwap(availableNft.mint)
        updateToastSuccess(toastId, 'Successfully swapped tokens for NFT!');
        setShowSuccessModal(true);
        // Reset form after a slight delay
        setTimeout(() => {
          setNftAmount('1')
          setTokenAmount(tokensPerNft.toString())
          setSelectedNftMint('')
          setSelectedNft(null)
        }, 500);
      }
    } catch (error) {
      console.error('Swap failed:', error)
      updateToastError(toastId, error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">
              {isNftToToken ? 'NFT → Tokens' : 'Tokens → NFT'}
            </h2>
            <p className="text-gray-400">
              1 $ASTRO = {tokensPerNft.toLocaleString()} $MOONL
            </p>
          </div>
          {connected && (
            <div className="text-sm text-gray-400">
              {truncateAddress(publicKey?.toBase58() || '')}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {/* First Input (NFT or Tokens depending on direction) */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">
                From ({isNftToToken ? 'NFT' : 'Tokens'})
              </label>
              <div className="text-sm text-gray-400 flex items-center gap-1">
                Balance: 
                {isMetadataLoading ? (
                  <FaSpinner className="animate-spin inline ml-1" />
                ) : (
                  <div className="flex items-center">
                    <span>
                      {isNftToToken 
                        ? `${availableNftMints.filter(nft => !nft.isLocked).length} $ASTRO`
                        : `${(tokenBalance / 1000000000).toLocaleString()} $MOONL`}
                    </span>
                    {((isNftToToken && availableNftMints.length === 0) || (!isNftToToken && tokenBalance === 0)) && (
                      <div className="relative group">
                        <FaInfoCircle className="ml-1 text-yellow-400 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 rounded-lg text-xs">
                          {isNftToToken 
                            ? "No NFTs available for swapping."
                            : "No token account found. It will be created when you receive tokens."}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={isNftToToken ? nftAmount : tokenAmount}
                  onChange={(e) => isNftToToken 
                    ? handleNftAmountChange(e.target.value)
                    : handleTokenAmountChange(e.target.value)
                  }
                  className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="0.0"
                  min="0"
                  step={isNftToToken ? "1" : tokensPerNft.toString()}
                  disabled={isLoading}
                />
                {isNftToToken 
                  ? <FaDiamond className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
                  : <FaCoins className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
                }
              </div>
            </div>
          </div>

          {/* NFT Selection - Show only when relevant */}
          {((isNftToToken && Number(nftAmount) > 0) || (!isNftToToken)) && connected && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">
                  {isNftToToken ? 'Select NFT to Swap' : 'Select NFT to Receive'}
                </label>
                {isMetadataLoading && (
                  <FaSpinner className="animate-spin text-yellow-400" />
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedNftMint}
                  onChange={(e) => handleNftSelect(e.target.value)}
                  className="flex-1 bg-transparent border border-gray-600 rounded-lg p-2 text-white [&>option]:text-black"
                  disabled={isLoading || isMetadataLoading}
                >
                  <option value="" className="text-black">Select an NFT</option>
                  {availableNftMints.map((nft) => (
                    <option 
                      key={nft.mint} 
                      value={nft.mint}
                      disabled={nft.isLocked}
                      className="text-black"
                    >
                      {nft.name} {nft.isLocked ? '(Locked)' : ''}
                    </option>
                  ))}
                </select>
                {selectedNft && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-3 py-1 bg-yellow-400/10 rounded-lg text-yellow-400 text-sm hover:bg-yellow-400/20 flex items-center justify-center"
                    title="Preview NFT"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ rotate: 180 }}
              className="bg-yellow-400/20 p-2 rounded-full"
              onClick={toggleSwapDirection}
              disabled={isLoading}
            >
              <FaArrowsRotate className="text-yellow-400" />
            </motion.button>
          </div>

          {/* Second Input (Tokens or NFT depending on direction) */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">
                To ({isNftToToken ? 'Tokens' : 'NFT'})
              </label>
              <div className="text-sm text-gray-400 flex items-center gap-1">
                Balance: 
                {isMetadataLoading ? (
                  <FaSpinner className="animate-spin inline ml-1" />
                ) : (
                  <div className="flex items-center">
                    <span>
                      {isNftToToken 
                        ? `${(tokenBalance / 1000000000).toLocaleString()} $MOONL`
                        : `${availableNftMints.filter(nft => !nft.isLocked).length} $ASTRO`}
                    </span>
                    {((isNftToToken && tokenBalance === 0) || (!isNftToToken && availableNftMints.length === 0)) && (
                      <div className="relative group">
                        <FaInfoCircle className="ml-1 text-yellow-400 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 rounded-lg text-xs">
                          {isNftToToken 
                            ? "No token account found. It will be created when you receive tokens."
                            : "No NFTs available for swapping."}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={isNftToToken ? tokenAmount : nftAmount}
                  onChange={(e) => isNftToToken 
                    ? handleTokenAmountChange(e.target.value)
                    : handleNftAmountChange(e.target.value)
                  }
                  className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="0.0"
                  step={isNftToToken ? tokensPerNft.toString() : "1"}
                  disabled={isLoading}
                />
                {isNftToToken 
                  ? <FaCoins className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
                  : <FaDiamond className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
                }
              </div>
            </div>
          </div>

          {/* Action Button */}
          {connected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwap}
              disabled={isLoading || isBalanceLoading || isMetadataLoading}
              className={`w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold flex items-center justify-center gap-2 ${
                (isLoading || isBalanceLoading || isMetadataLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading && <FaSpinner className="animate-spin" />}
              {isLoading ? 'Swapping...' : 'Swap'}
            </motion.button>
          ) : (
            <WalletMultiButton className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold flex justify-center" />
          )}
        </div>
      </motion.div>

      {/* NFT Preview Modal */}
      {showPreview && selectedNft && (
        <NftPreviewModal
          nft={selectedNft}
          onClose={() => setShowPreview(false)}
        />
      )}
      {/* Success Modal */}
      <SwapSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isNftToToken={isNftToToken}
        nftAmount={Number(nftAmount)}
        tokenAmount={Number(tokenAmount)}
      />
    </div>
  )
}

export default SwapPage