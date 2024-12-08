// components/NFTSkeleton.tsx
export const NFTSkeleton = () => {
    return (
      <div className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-700/50" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-700/50 rounded w-3/4" />
          <div className="h-4 bg-gray-700/50 rounded w-full" />
          <div className="h-4 bg-gray-700/50 rounded w-1/2" />
        </div>
      </div>
    );
  };