"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUnlock, FaDiamond, FaCoins, FaChartLine } from 'react-icons/fa6';

const LockPage = () => {
  const [activeTab, setActiveTab] = useState<'lock' | 'unlock'>('lock');
  const [assetType, setAssetType] = useState<'nft' | 'token'>('nft');

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <FaChartLine className="text-yellow-400 text-3xl mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">$2.5M</h3>
            <p className="text-gray-400">Total Value Locked</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-1">15% APY</h3>
            <p className="text-gray-400">Current Lock Rate</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-1">250</h3>
            <p className="text-gray-400">Active Lockers</p>
          </motion.div>
        </div>

        {/* Main Lock Interface */}
        <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('lock')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'lock'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <FaLock className="inline mr-2" /> Lock
            </button>
            <button
              onClick={() => setActiveTab('unlock')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'unlock'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <FaUnlock className="inline mr-2" /> Unlock
            </button>
          </div>

          {/* Asset Type Selection */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Asset Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAssetType('nft')}
                className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                  assetType === 'nft'
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <FaDiamond /> NFT
              </button>
              <button
                onClick={() => setAssetType('token')}
                className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                  assetType === 'token'
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <FaCoins /> Tokens
              </button>
            </div>
          </div>

          {/* Lock/Unlock Form */}
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Amount</label>
                <span className="text-sm text-gray-400">
                  Balance: {assetType === 'nft' ? '2 $POXNFT' : '5M $POX'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="flex-1 bg-transparent border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="0.0"
                />
                <button className="px-3 py-1 bg-yellow-400/10 rounded-lg text-yellow-400 text-sm hover:bg-yellow-400/20">
                  MAX
                </button>
              </div>
            </div>

            {activeTab === 'lock' && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-400">Lock Duration</label>
                  <span className="text-sm text-yellow-400">Higher APY for longer locks</span>
                </div>
                <select className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-white">
                  <option value="30">30 Days - 15% APY</option>
                  <option value="90">90 Days - 25% APY</option>
                  <option value="180">180 Days - 40% APY</option>
                </select>
              </div>
            )}

            {/* Benefits Display */}
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Benefits</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Earn up to 40% APY on locked assets</li>
                <li>• Participate in governance decisions</li>
                <li>• Access to exclusive NFT airdrops</li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg text-gray-900 font-bold"
            >
              Connect Wallet
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPage;