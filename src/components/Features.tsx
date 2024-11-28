"use client"

import { motion } from "framer-motion";
import { FaRocket, FaArrowsRotate, FaTelegram } from "react-icons/fa6";

const Features = () => (
    <div className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-12">
          Why Choose POX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Seamless Trading",
              description: "Trade both tokens and NFTs in one unified platform",
              icon: FaArrowsRotate,
            },
            {
              title: "Security First",
              description: "Built with advanced security measures and audited smart contracts",
              icon: FaRocket,
            },
            {
              title: "Community Driven",
              description: "Governed by the community through DAO mechanisms",
              icon: FaTelegram,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
            >
              <feature.icon className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  export default Features;