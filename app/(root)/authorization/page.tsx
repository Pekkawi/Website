'use client';
import AuthroizationList from '@/components/Authroization Page/AuthroizationList';
import { motion } from 'framer-motion';

const AuthorizationPage = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="background background-light900_dark300 mt-[-30px]">
          <h1 className="h1-bold text-dark100_light900">Authroization</h1>
          <p className="mb-3 mt-[-10px] text-gray-500">Manage access to the website</p>
          <AuthroizationList />
        </div>
      </motion.div>
    </>
  );
};

export default AuthorizationPage;
