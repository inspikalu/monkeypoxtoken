"use client";

// NftPreviewModal.tsx
import React from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

interface NftPreviewModalProps {
  nft: { name: string; imageUrl: string; description: string }; // Define the NFT structure
  onClose: () => void;
}

const NftPreviewModal: React.FC<NftPreviewModalProps> = ({ nft, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-yellow-400">{nft.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-400">{nft.description}</p>
      </div>
    </div>
  );
};

interface SwapSuccessModalProps {
  onClose: () => void;
}

const SwapSuccessModal: React.FC<SwapSuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-green-600 p-6 rounded-lg max-w-md w-full text-center">
        <FaCheckCircle className="text-white text-5xl mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Swap Successful!
        </h3>
        <p className="text-white mb-4">Your swap was completed successfully.</p>
        <button
          onClick={onClose}
          className="bg-yellow-400 text-black py-2 px-8 rounded-lg font-semibold hover:bg-yellow-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { NftPreviewModal, SwapSuccessModal };
