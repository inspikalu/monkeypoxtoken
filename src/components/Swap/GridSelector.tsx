import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const GridSelector = ({ 
  items, 
  selectedItem, 
  onSelect, 
  type 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.symbol && item.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        {filteredItems.map((item) => (
          <motion.div
            key={item.mintAddress}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item)}
            className={`cursor-pointer rounded-lg p-3 border transition-colors ${
              selectedItem?.mintAddress === item.mintAddress
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-gray-700">
              {type === 'NFT' && item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {item.symbol || item.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-sm font-medium truncate">{item.name}</div>
            {item.symbol && (
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
};

export default GridSelector;