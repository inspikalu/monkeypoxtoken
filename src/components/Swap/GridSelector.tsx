import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { UserNFTokens, UserFTokens } from './swap-types';
import axios from 'axios';

type ItemType = UserNFTokens | UserFTokens;

interface GridSelectorProps<T extends ItemType> {
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T) => void;
  type: T extends UserNFTokens ? 'NFT' : 'Token';
}

// Global cache for metadata images
const imageCache = new Map<string, Promise<string | null>>();

export const getTokenMetadataImage = async function(url: string) {
  // Check if this URL is already being fetched
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  // Create a new promise for this URL
  const imagePromise = axios.get(url)
    .then(response => response?.data?.image as string)
    .catch(error => {
      console.error('Error fetching metadata:', error);
      return null;
    });

  // Store the promise in the cache
  imageCache.set(url, imagePromise);
  return imagePromise;
};

function GridSelector<T extends ItemType>({
  items,
  selectedItem,
  onSelect,
  type,
}: GridSelectorProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loadedImages, setLoadedImages] = React.useState<Set<string>>(new Set());

  const filteredItems = React.useMemo(() =>
    items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ('symbol' in item && item.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [items, searchTerm]
  );

  const isToken = (item: T): item is UserFTokens & T => 'symbol' in item;

  // Preload images for visible items
  React.useEffect(() => {
    const preloadImages = async () => {
      const promises = filteredItems
        .filter(item => item.uri && !loadedImages.has(item.uri))
        .map(async item => {
          if (!item.uri) return;

          try {
            const imageUrl = await getTokenMetadataImage(item.uri);
            if (imageUrl) {
              // Create an image object to preload
              const img = new Image();
              img.src = imageUrl;
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });

              setLoadedImages(prev => new Set([...prev, item.uri!]));
            }
          } catch (error) {
            console.error('Error preloading image:', error);
          }
        });

      await Promise.all(promises);
    };

    preloadImages();
  }, [filteredItems, loadedImages]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={`Search ${type}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                     focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-2">
        {filteredItems.map((item, index) => (
          <motion.div
            key={`${item.mintAddress}_${index}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item)}
            className={`cursor-pointer rounded-lg p-3 border transition-colors ${selectedItem?.mintAddress === item.mintAddress
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
          >
            <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-gray-700">
              {item.uri ? (
                <MetadataImage
                  uri={item.uri}
                  name={item.name}
                  isLoaded={loadedImages.has(item.uri)}
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                      {isToken(item) ? item.symbol : item.name.charAt(0)}
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {isToken(item) ? item.symbol : item.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-sm font-medium truncate">{item.name}</div>
            {isToken(item) && (
              <div className="text-xs text-gray-400">{item.symbol}</div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No {type}s found
        </div>
      )}
    </div>
  );
}

interface MetadataImageProps {
  uri: string;
  name: string;
  isLoaded: boolean;
  fallback: React.ReactNode;
}

const MetadataImage = React.memo(
  ({ uri, name, isLoaded, fallback }: MetadataImageProps) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      let mounted = true;

      const loadImage = async () => {
        try {
          const url = await getTokenMetadataImage(uri);
          if (mounted && url) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };

      if (!imageUrl) {
        loadImage();
      }

      return () => {
        mounted = false;
      };
    }, [uri, imageUrl]);

    if (!isLoaded || !imageUrl) {
      return <>{fallback}</>;
    }

    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }
);

MetadataImage.displayName = 'MetadataImage';

export default GridSelector;
