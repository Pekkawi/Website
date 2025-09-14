'use client';
import React from 'react';
import PermissionsForm from '@/components/Permissions Page/PermissionsForm';
import PermissionList from '@/components/Permissions Page/PermissionList';
import { motion } from 'framer-motion';

const PermissionPage = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="background background-light900_dark300 mt-[-30px]">
          <h1 className="h1-bold text-dark100_light900">New Permissions</h1>
          <p className="mb-3 mt-[-8px] text-gray-500">Add a new device group</p>
          <PermissionsForm />
        </div>

        <div className="background background-light900_dark300 mt-8">
          <h1 className="h1-bold text-dark100_light900">Permissions</h1>
          <p className="mb-3 mt-[-10px] text-gray-500">Available device groups</p>
          <PermissionList />
        </div>
      </motion.div>
    </>
  );
};

export default PermissionPage;
