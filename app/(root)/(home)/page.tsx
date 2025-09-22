'use client';
import { motion } from 'framer-motion';

import { FaUserShield, FaTools, FaPlusCircle } from 'react-icons/fa';
import React from 'react';

const Home = () => {
  return (
    <>
      <div className="background background-light900_dark300 h-[70vh] mt-[-30px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="h1-bold text-dark100_light900">About this page </h1>
          <p className="mb-6 text-gray-700">
            The official webpage of the student workshop at SDU Sønderborg.
          </p>

          <div className="mt-10 flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <FaUserShield className="text-4xl text-orange-600" />
              <p className="font-medium text-gray-700">
                <b>User Management</b>: View and manage user roles and permissions easily.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaTools className="text-4xl text-orange-600" />
              <p className="font-medium text-gray-700">
                <b>Permission Control</b>: Add or Remove a new Machine Type.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaPlusCircle className="text-4xl text-orange-600" />
              <p className="font-medium text-gray-700">
                <b>Machine Management</b>: View machine status and history.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
