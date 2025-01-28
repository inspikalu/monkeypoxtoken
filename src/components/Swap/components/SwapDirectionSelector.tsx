import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";

interface SwapDirectionSelectorProps {
    onNext: () => void;
    onPrev: () => void;
    isNftToToken: boolean;
    toggleSwapDirection: () => void;
}

const SwapDirectionSelector: React.FC<SwapDirectionSelectorProps> = ({
    onNext,
    onPrev,
    isNftToToken,
    toggleSwapDirection,
}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                    Choose The Swap Direction
                </h2>

                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-lg font-medium">
                            {isNftToToken ? "NFT to TOKEN" : "TOKEN to NFT"}
                        </div>
                        <button
                            onClick={toggleSwapDirection}
                            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ArrowUpDown className="w-5 h-5" />
                            <span>Toggle Direction</span>
                        </button>
                    </div>

                    <div className="flex justify-between gap-4">
                        <button
                            onClick={onPrev}
                            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={onNext}
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

export default SwapDirectionSelector;