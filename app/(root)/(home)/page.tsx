'use client';
import { motion } from 'framer-motion';
import {
  FaUserShield,
  FaTools,
  FaPlusCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import React from 'react';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isUser = userRole === 'User';

  return (
    <>
      <div className="background background-light900_dark300 mt-[-30px] h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="h1-bold text-dark100_light900">About this page</h1>
          <p className="mb-6 text-gray-700">
            The official webpage of the student workshop at SDU Sønderborg.
          </p>

          {/* Simple warning for Users only */}
          {isUser && (
            <div className="mb-6 rounded border-l-4 border-orange-500 bg-orange-50 p-4 dark:bg-orange-900/20">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-lg text-orange-600" />
                <p className="font-medium text-orange-800 dark:text-orange-400">
                  Limited Access - Waiting for Admin Approval
                </p>
              </div>
              <p className="ml-6 mt-1 text-sm text-orange-700 dark:text-orange-500">
                Contact a workshop administrator to get full access to the webpage.
              </p>
            </div>
          )}

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
