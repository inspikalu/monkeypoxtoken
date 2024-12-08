// components/ErrorDisplay.tsx
import { FaSync } from 'react-icons/fa';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 mx-auto hover:bg-yellow-500 transition-colors"
      >
        Try Again <FaSync />
      </button>
    </div>
  </div>
);