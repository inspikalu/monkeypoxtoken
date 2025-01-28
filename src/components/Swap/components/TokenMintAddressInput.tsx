import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TokenMintAddressInputProps {
    onNext: () => void;
    onPrev: () => void;
    tokenMintAddress: string | null;
    setTokenMintAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const TokenMintAddressInput: React.FC<TokenMintAddressInputProps> = ({
    onNext,
    onPrev,
    tokenMintAddress,
    setTokenMintAddress,
}) => {
    const [inputValue, setInputValue] = useState(tokenMintAddress ? tokenMintAddress : "");

    const handleNext = () => {
        if (!inputValue.trim()) {
            toast.error("Please enter a valid token mint address.");
            return;
        }
        setTokenMintAddress(inputValue.trim());
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
                    Enter Token Mint Address
                </h2>

                <div className="space-y-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Token Mint Address"
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white placeholder-gray-400"
                    />

                    <div className="flex justify-between gap-4">
                        <button
                            onClick={onPrev}
                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-medium transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TokenMintAddressInput;