"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { FaLock, FaExchangeAlt, FaInfoCircle, FaRocket } from "react-icons/fa";
import StatsSection from "./Stats";
import ContractAddress from "./ContractAddress";
import Footer from "./Footer";
import Features from "./Features";
import Page from "./Page";
import { NavigationContext } from "./Landing";

const HomePage = () => {
  const { setCurrentPage } = useContext(NavigationContext);

  return (
    <Page>
      <div>
        {/* Hero Section */}
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-gray-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.1),transparent_50%)]" />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-5xl relative z-10"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 mt-8"
            >
              <span className="px-4 py-2 bg-yellow-400/10 rounded-full text-yellow-400 text-sm font-semibold">
                SPL-404 TOKEN ON SOLANA
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Welcome to MOONLAMBO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              The future of decentralized asset trading
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Blending memecoin and NFT cultures into one revolutionary
              platform. Trade, swap, and lock both fungible and non-fungible
              assets in a seamless ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-shadow flex items-center justify-center gap-2"
              >
                Coming Soon <FaRocket />
              </motion.button>
              {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-shadow flex items-center justify-center gap-2"
            >
              Launch App <FaArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-800/50 backdrop-blur rounded-full text-yellow-400 font-bold text-lg border border-yellow-400/20 hover:border-yellow-400/50 transition-colors"
            >
              Learn More
            </motion.button> */}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400">18B+</h3>
                <p className="text-gray-400">Total Supply</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400">18B+</h3>
                <p className="text-gray-400">$MOONL Supply</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400">100K</h3>
                <p className="text-gray-400">$MOONL per NFT</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tokenomics Section */}
        <section className="py-20 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-yellow-400 mb-6">
                Tokenomics
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                MoonLambo introduces a revolutionary tokenomics model that
                bridges the gap between fungible tokens and NFTs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Token Info */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Token Details
                </h3>
                <div className="space-y-4">
                  <ContractAddress />
                  <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white">
                      18,446,744,073.709551615 $MOONL
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <span className="text-gray-400">$ASTRO NFT Supply</span>
                    <span className="text-white">10 $ASTRO</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Swap Rate</span>
                    <span className="text-white">1 $ASTR0 = 100K $MOONL</span>
                  </div>
                </div>
              </motion.div>

              {/* NFT Features */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  MPL-404 Features
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <FaExchangeAlt className="text-yellow-400 text-xl mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Seamless Swaps
                      </h4>
                      <p className="text-gray-400">
                        Easily swap between fungible and non-fungible assets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaLock className="text-yellow-400 text-xl mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Asset Locking
                      </h4>
                      <p className="text-gray-400">
                        Lock your assets for enhanced security and earning
                        potential
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaInfoCircle className="text-yellow-400 text-xl mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Hybrid Assets
                      </h4>
                      <p className="text-gray-400">
                        Unique token + NFT hybrid system with full
                        interchangeability
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage("swap")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl py-4 px-6 text-gray-900 font-bold flex items-center justify-center gap-2"
              >
                Swap Assets <FaExchangeAlt />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800/50 backdrop-blur rounded-xl py-4 px-6 text-yellow-400 font-bold border border-yellow-400/20 hover:border-yellow-400/50 flex items-center justify-center gap-2"
              >
                Lock Assets <FaLock />
              </motion.button>
            </div>
          </div>
        </section>

        <StatsSection />
        <Features />
      </div>
      <Footer />
    </Page>
  );
};

export default HomePage;
