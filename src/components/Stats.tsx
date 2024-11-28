"use client"

import { motion } from "framer-motion";
import { FaRocket, FaArrowsRotate, FaChartLine } from "react-icons/fa6";

const StatsSection = () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Value Locked", value: "$10M+", icon: FaChartLine },
          { label: "Active Users", value: "50K+", icon: FaRocket },
          { label: "Daily Transactions", value: "100K+", icon: FaArrowsRotate },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">{stat.value}</h4>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  export default StatsSection;