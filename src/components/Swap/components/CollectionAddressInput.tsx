import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CollectionAddressInputProps {
    onNext: () => void;
    collectionAddress: string | null;
    setCollectionAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const CollectionAddressInput: React.FC<CollectionAddressInputProps> = ({
    onNext,
    collectionAddress,
    setCollectionAddress,
}) => {
    const [inputValue, setInputValue] = useState(collectionAddress ? collectionAddress : "");

    const handleNext = () => {
        if (!inputValue.trim()) {
            toast.error("Please enter a valid collection address.");
            return;
        }
        setCollectionAddress(inputValue.trim());
        onNext();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                    Enter Collection Address
                </h2>

                <div className="space-y-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Collection Address"
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white placeholder-gray-400"
                    />

                    <button
                        onClick={handleNext}
                        className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-medium transition-colors"
                    >
                        Next
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CollectionAddressInput;