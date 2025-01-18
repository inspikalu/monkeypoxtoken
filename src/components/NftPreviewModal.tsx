// components/NftPreviewModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaSpinner,
  FaImage,
  FaRedo,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import type { NftMetadata } from "@/lib/hooks/useSwap";

interface NftPreviewModalProps {
  nft: NftMetadata | null;
  onClose: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const NftPreviewModal = ({ nft, onClose }: NftPreviewModalProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isZoomed, onClose]);

  if (!nft) return null;

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    setIsRetrying(false);
  };

  const handleRetry = async () => {
    if (retryCount >= MAX_RETRIES || !nft.image) return;

    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Add a small delay before retrying
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

    setImageLoading(true);
    setImageError(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => (isZoomed ? setIsZoomed(false) : onClose())}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-gray-800 rounded-xl p-6 ${
            isZoomed ? "w-[90vw] h-[90vh]" : "max-w-lg w-full"
          } 
            transition-all duration-300 ease-in-out`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-yellow-400">{nft.name}</h3>
              {retryCount > 0 && !imageError && (
                <span className="text-xs text-gray-400">
                  (Attempt {retryCount}/{MAX_RETRIES})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {nft.image && !imageError && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleZoom}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isZoomed ? (
                    <FaCompress className="text-gray-400" />
                  ) : (
                    <FaExpand className="text-gray-400" />
                  )}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" />
              </motion.button>
            </div>
          </div>

          <div
            className={`relative rounded-lg overflow-hidden bg-gray-900 
            ${isZoomed ? "h-[calc(90vh-200px)]" : "aspect-square"}`}
          >
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-yellow-400" />
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <FaImage className="text-4xl mb-2" />
                <span className="text-sm mb-2">Failed to load image</span>
                {retryCount < MAX_RETRIES && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isRetrying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 1,
                      repeat: isRetrying ? Infinity : 0,
                    }}
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 
                      rounded-lg text-yellow-400 transition-colors disabled:opacity-50"
                  >
                    <FaRedo className="text-sm" />
                    <span className="text-sm">
                      {isRetrying ? "Retrying..." : "Retry"}
                    </span>
                  </motion.button>
                )}
                {retryCount >= MAX_RETRIES && (
                  <span className="text-xs text-gray-400 mt-1">
                    Max retries reached
                  </span>
                )}
              </div>
            ) : (
              nft.image && (
                <motion.img
                  key={`${nft.image}-${retryCount}`}
                  src={nft.image}
                  alt={nft.name}
                  className={`${
                    isZoomed ? "object-contain" : "object-cover"
                  } w-full h-full`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoading ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  onLoad={() => setImageLoading(false)}
                  onError={handleImageError}
                />
              )
            )}
          </div>

          <div className="mt-4 space-y-4">
            {nft.description && (
              <p className="text-gray-300 text-sm">{nft.description}</p>
            )}

            {nft.attributes && nft.attributes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400">
                  Attributes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/50 rounded-lg p-2"
                    >
                      <div className="text-xs text-gray-400">
                        {attr.trait_type}
                      </div>
                      <div className="text-sm text-white">{attr.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span>Mint Address:</span>
                <span className="text-yellow-400 font-mono text-xs">
                  {nft.mint}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
