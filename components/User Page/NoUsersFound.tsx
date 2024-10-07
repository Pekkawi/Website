import React from 'react';
import { motion } from 'framer-motion';
import { Search, Frown} from 'lucide-react';

const NoUsersFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="mb-4"
      >
        <Search size={64} className="text-gray-400" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-dark100_light900 mb-2 text-2xl font-bold"
      >
        No Users Found
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-dark500_light700 mb-4"
      >
        We couldn&apos;t find any users matching your search criteria.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <Frown className="text-gray-400" />
        <span className="text-dark500_light700"> Don&apos;t worry, try adjusting your search.</span>
      </motion.div>
      
    </motion.div>
  );
};

export default NoUsersFound;