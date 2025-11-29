'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Documentation = () => {
  return (
    <>
      <div className="background background-light900_dark300 mt-[-30px] h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="h1-bold text-dark100_light900">Documentation</h1>
          <p className="mb-6 text-gray-700">
            The official webpage of the student workshop at SDU Sønderborg.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Documentation;
