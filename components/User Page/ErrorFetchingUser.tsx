import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFetchingUsers = ({ onRetry }: { onRetry: () => void }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md dark:bg-dark-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-4 text-orange-500"
        variants={childVariants}
      >
        <AlertTriangle size={64} />
      </motion.div>
      
      <motion.h2
        className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200"
        variants={childVariants}
      >
        Oops! Something went wrong
      </motion.h2>
      
      <motion.p
        className="mb-6 text-gray-600 dark:text-gray-400"
        variants={childVariants}
      >
        We couldn&apos;t fetch the user data. This might be due to a network issue or a problem with our servers.
      </motion.p>
      
      <motion.button
        className="flex items-center justify-center space-x-2 rounded-full bg-orange-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-orange-600"
        variants={childVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
      >
        <RefreshCw size={20} />
        <span>Try Again</span>
      </motion.button>
    </motion.div>
  );
};

export default ErrorFetchingUsers;