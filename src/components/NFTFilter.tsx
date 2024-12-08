// components/NFTFilters.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaLock } from 'react-icons/fa';

interface NFTFiltersProps {
  onSearch: (query: string) => void;
  onSort: (value: 'name' | 'recent' | 'locked') => void;
}

export const NFTFilters = ({ onSearch, onSort }: NFTFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search NFTs by name or description..."
          className="w-full bg-gray-800/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 
            border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
        />
      </div>
      
      {/* Sort Options */}
      <div className="flex gap-2">
        <select
          onChange={(e) => onSort(e.target.value as 'name' | 'recent' | 'locked')}
          className="bg-gray-800/50 rounded-lg px-4 py-2 text-white border border-gray-700 
            focus:border-yellow-400 focus:outline-none appearance-none cursor-pointer transition-colors
            hover:bg-gray-700/50"
        >
          <option value="name">Sort by Name</option>
          <option value="recent">Sort by Recent</option>
          <option value="locked">Sort by Status</option>
        </select>

        {/* Filter Buttons */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg 
            flex items-center gap-2 transition-colors"
          onClick={() => onSort('locked')}
        >
          <FaLock className="text-sm" />
          Status
        </motion.button>
      </div>
    </div>
  );
};