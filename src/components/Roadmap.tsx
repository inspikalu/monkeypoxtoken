"use client"

import { motion } from "framer-motion";
import { FaArrowTrendUp } from "react-icons/fa6";


const RoadmapPage = () => (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-yellow-400 text-center mb-12">Project Roadmap</h2>
          <div className="space-y-12">
            {[
              {
                phase: "Phase 1",
                title: "Foundation",
                items: ["Token Launch", "Community Building", "Initial Partnerships"]
              },
              {
                phase: "Phase 2",
                title: "Expansion",
                items: ["NFT Marketplace", "DEX Integration", "Staking Platform"]
              },
              {
                phase: "Phase 3",
                title: "Innovation",
                items: ["Cross-chain Bridge", "DAO Governance", "Advanced Trading Features"]
              }
            ].map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-yellow-400 text-xl font-bold">{phase.phase}</span>
                  <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center space-x-2 text-gray-300">
                      <FaArrowTrendUp className="text-yellow-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                  </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
);

export default RoadmapPage;