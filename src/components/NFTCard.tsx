// components/NFTCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaImage, FaExternalLinkAlt, FaInfoCircle, FaLock } from 'react-icons/fa';
import type { NFTMetadata } from '@/types/nft';

interface NFTCardProps {
  nft: NFTMetadata;
  index: number;
  onClick?: () => void;
}

export const NFTCard = ({ nft, index, onClick }: NFTCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 group 
        ${nft.isLocked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}`}
      onClick={() => !nft.isLocked && onClick?.()}
    >
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-yellow-400/20 to-purple-600/20 relative overflow-hidden">
        {/* Locked Overlay */}
        {nft.isLocked && (
          <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-2">
            <FaLock className="text-4xl text-yellow-400" />
            <span className="text-yellow-400 text-sm">NFT is locked</span>
          </div>
        )}

        {/* Image */}
        {nft.image && !imageError ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <FaSpinner className="animate-spin text-2xl text-yellow-400" />
              </div>
            )}
            <img 
              src={nft.image} 
              alt={nft.name}
              className={`w-full h-full object-cover transition-transform duration-300 
                ${!nft.isLocked && 'group-hover:scale-105'}`}
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
            />
            {/* Hover Overlay - only show if not locked */}
            {!nft.isLocked && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  View Details <FaExternalLinkAlt />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <FaImage className="text-4xl text-yellow-400/50" />
            <span className="text-yellow-400 text-xl text-center px-4">{nft.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-yellow-400 truncate">{nft.name}</h3>
          {nft.symbol && (
            <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full">
              {nft.symbol}
            </span>
          )}
        </div>

        <p className="text-gray-400 mt-2 line-clamp-2">
          {nft.description || 'No description available'}
        </p>

        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {nft.attributes.slice(0, 3).map((attr, i) => (
              <span
                key={i}
                className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
              >
                {attr.trait_type}: {attr.value}
              </span>
            ))}
            {nft.attributes.length > 3 && (
              <span className="text-xs text-gray-400">+{nft.attributes.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-mono hover:text-yellow-400 transition-colors">
              {nft.mint.slice(0, 4)}...{nft.mint.slice(-4)}
            </p>
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              {nft.isLocked && (
                <span className="text-xs bg-red-400/20 text-red-400 px-2 py-1 rounded-full flex items-center gap-1">
                  <FaLock className="text-xs" />
                  Locked
                </span>
              )}
              <div className="group/info relative">
                <FaInfoCircle className="text-gray-400 hover:text-yellow-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/info:block w-48 p-2 bg-gray-900 rounded-lg text-xs text-gray-300">
                  {nft.isLocked 
                    ? 'This NFT is currently locked and cannot be interacted with'
                    : 'Click to view full details and attributes'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};