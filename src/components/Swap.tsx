"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowsRotate, FaDiamond, FaCoins } from 'react-icons/fa6';

const SwapPage = () => {
  const [nftAmount, setNftAmount] = useState<string>('1');
  const [tokenAmount, setTokenAmount] = useState<string>('2000000');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Swap Assets</h2>
        <p className="text-gray-400 mb-6">1 $POXNFT = 2,000,000 $POX</p>
        
        <div className="space-y-4">
          {/* NFT Input */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">From (NFT)</label>
              <span className="text-sm text-gray-400">Balance: 2 $POXNFT</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={nftAmount}
                  onChange={(e) => {
                    setNftAmount(e.target.value);
                    setTokenAmount((Number(e.target.value) * 2000000).toString());
                  }}
                  className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="0.0"
                  min="0"
                  max="500"
                />
                <FaDiamond className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
              </div>
              <button className="px-3 py-1 bg-yellow-400/10 rounded-lg text-yellow-400 text-sm hover:bg-yellow-400/20">
                MAX
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ rotate: 180 }}
              className="bg-yellow-400/20 p-2 rounded-full"
            >
              <FaArrowsRotate className="text-yellow-400" />
            </motion.button>
          </div>

          {/* Token Input */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">To (Tokens)</label>
              <span className="text-sm text-gray-400">Balance: 5M $POX</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => {
                    setTokenAmount(e.target.value);
                    setNftAmount((Number(e.target.value) / 2000000).toString());
                  }}
                  className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="0.0"
                />
                <FaCoins className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50" />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold"
          >
            Connect Wallet
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SwapPage;