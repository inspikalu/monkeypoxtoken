"use client"

import { motion } from 'framer-motion';


const NFTPage = () => (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-yellow-400/20 to-purple-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-yellow-400 text-xl">NFT #{i + 1}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-yellow-400">ASTRO NFT Collection</h3>
                <p className="text-gray-400 mt-2">Unique digital assets with real utility</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
);

export default NFTPage;