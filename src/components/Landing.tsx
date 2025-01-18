"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket,
  FaBars,
  FaX,
  FaPaintbrush,
  FaRoad,
  FaArrowsRotate,
  FaLock,
} from "react-icons/fa6";
import HomePage from "./Hero";
import NFTPage from "@/app/nft/page";
import SwapPage2 from "./Swap";
import SwapPage from "./Swap/Swap";
import RoadmapPage from "./Roadmap";
import Footer from "./Footer";
import Page from "./Page";
import LockPage from "./Lock";
import LaunchpadPage from "./Launchpad/Launchpad";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType;
}

// type PageId =
//   | "home"
//   | "nfts"
//   | "swap"
//   | "swap2"
//   | "lock"
//   | "roadmap"
//   | "launchpad";

type PageId = "home" | "nfts" | "swap" | "launchpad";

interface NavigationContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

interface MousePosition {
  x: number;
  y: number;
}

export const NavigationContext = React.createContext<NavigationContextType>({
  currentPage: "home",
  setCurrentPage: () => {},
});

const TokenApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (
        isMobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-trigger")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: FaRocket },
    { id: "nfts", label: "NFTs", icon: FaPaintbrush },
    { id: "swap", label: "Swap", icon: FaArrowsRotate },
    // { id: "swap2", label: "Swap2", icon: FaArrowsRotate },
    // { id: "lock", label: "Lock", icon: FaLock },
    // { id: "roadmap", label: "Roadmap", icon: FaRoad },
    { id: "launchpad", label: "Launchpad", icon: FaRocket },
  ];

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-[#111827] to-gray-900 ${
          isMobileMenuOpen ? "overflow-hidden" : ""
        }`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(250,204,21,0.15),transparent_50%)]"
            style={
              {
                "--mouse-x": `${mousePosition.x}px`,
                "--mouse-y": `${mousePosition.y}px`,
              } as React.CSSProperties
            }
          />
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-yellow-400/10 rounded-full"
              initial={{
                x:
                  typeof window !== "undefined"
                    ? Math.random() * window.innerWidth
                    : 0,
                y:
                  typeof window !== "undefined"
                    ? Math.random() * window.innerHeight
                    : 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * -100],
                x: Math.random() * 50,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2"
                >
                  <FaRocket className="text-yellow-400 animate-pulse h-8 w-8" />
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                    MOONLAMBO
                  </span>
                </motion.div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                {navItems.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === id
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                    onClick={() => setCurrentPage(id)}
                  >
                    {label}
                  </motion.button>
                ))}
                <WalletMultiButton />
              </div>

              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="menu-trigger p-2 rounded-md text-gray-300 hover:text-yellow-400"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <FaX /> : <FaBars />}
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="mobile-menu md:hidden fixed inset-y-0 left-0 w-64 bg-gray-900/80 backdrop-blur-xl shadow-lg z-50 border-r border-gray-700/50"
                >
                  <div className="pt-20 px-4">
                    {navItems.map(({ id, label, icon: Icon }) => (
                      <motion.button
                        key={id}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg mb-2 ${
                          currentPage === id
                            ? "bg-yellow-400/20 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                        onClick={() => {
                          setCurrentPage(id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Icon />
                        <span>{label}</span>
                      </motion.button>
                    ))}
                    <WalletMultiButton />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>

        <main className={`pt-16 ${isMobileMenuOpen ? "blur-sm" : ""}`}>
          <AnimatePresence mode="wait">
            {currentPage === "home" && <HomePage key="home" />}
            {currentPage === "nfts" && (
              <Page key="nfts">
                <NFTPage />
                <Footer />
              </Page>
            )}
            {currentPage === "swap" && (
              <Page key="swap">
                <SwapPage />
                <Footer />
              </Page>
            )}
            {/* {currentPage === "swap2" && (
              <Page key="swap2">
                <SwapPage2 />
                <Footer />
              </Page>
            )}
            {currentPage === "lock" && (
              <Page key="lock">
                <LockPage />
                <Footer />
              </Page>
            )}
            {currentPage === "roadmap" && (
              <Page key="roadmap">
                <RoadmapPage />
                <Footer />
              </Page>
            )} */}
            {currentPage === "launchpad" && (
              <Page key="launchpad">
                <LaunchpadPage />
                <Footer />
              </Page>
            )}
          </AnimatePresence>
        </main>
      </div>
    </NavigationContext.Provider>
  );
};

export default TokenApp;
