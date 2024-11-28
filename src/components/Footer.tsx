"use client"

import { motion } from 'framer-motion';
import { FaTelegram, FaXTwitter } from 'react-icons/fa6';

const Footer = () => (
    <footer className="bg-gray-900/50 backdrop-blur-sm py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-yellow-400 text-lg font-bold mb-4">About POX</h4>
          <p className="text-gray-400">
            Revolutionary decentralized platform for trading both fungible and non-fungible assets.
          </p>
        </div>
        <div>
          <h4 className="text-yellow-400 text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Whitepaper
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-yellow-400 text-lg font-bold mb-4">Community</h4>
          <div className="flex space-x-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaXTwitter className="h-6 w-6" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaTelegram className="h-6 w-6" />
            </motion.a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <p>© 2024 POX. All rights reserved.</p>
      </div>
    </footer>
  );

  export default Footer;