import { motion } from "framer-motion";

interface PageProps {
    children: React.ReactNode;
  }
const Page: React.FC<PageProps> = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );

  export default Page;