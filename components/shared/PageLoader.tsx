import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
        <div className="-mt-48 flex items-center justify-center">
      <motion.div
        className="size-16 rounded-full border-t-4 border-solid border-blue-500"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      </div>
    </div>
  );
};

export default PageLoader;