import React from 'react';
import { motion } from 'framer-motion';
import { FaXmark, FaDiamond, FaCoins } from 'react-icons/fa6';

interface SwapSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNftToToken: boolean;
  nftAmount: number;
  tokenAmount: number;
}

const SwapSuccessModal = ({ isOpen, onClose, isNftToToken, nftAmount, tokenAmount }: SwapSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
              {isNftToToken ? <FaCoins className="w-6 h-6 text-green-500" /> : <FaDiamond className="w-6 h-6 text-green-500" />}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Swap Successful!</h3>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <p className="text-gray-300">
              {isNftToToken ? (
                <>
                  You have successfully swapped <span className="text-yellow-400">{nftAmount} NFT</span> for{' '}
                  <span className="text-yellow-400">{(tokenAmount / 1000000000).toLocaleString()} $MOONL</span>
                </>
              ) : (
                <>
                  You have successfully swapped{' '}
                  <span className="text-yellow-400">{(tokenAmount / 1000000000).toLocaleString()} $MOONL</span> for{' '}
                  <span className="text-yellow-400">{nftAmount} NFT</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-bold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SwapSuccessModal;