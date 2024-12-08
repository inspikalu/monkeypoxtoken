import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';  // Import copy icon
// import { Tooltip } from 'react-tooltip';  // Optional: Tooltip for better UX

const ContractAddress = () => {
  const address = "4F9WCp4Dzv9SMf9auVQBbmXH97sVWT28mTzvqiSwgvUR";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-700 pb-4">
      <span className="text-gray-400">Contract Address</span>
      <div className="flex items-center space-x-2">
        <code className="text-sm text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
          {`${address.slice(0, 4)}...${address.slice(-4)}`}
        </code>
        <button onClick={handleCopy} className="text-gray-400 hover:text-yellow-400">
          <FiCopy size={20} />
        </button>
        {copied && <span className="text-xs text-green-400">Copied!</span>}
      </div>
    </div>
  );
};

export default ContractAddress;
