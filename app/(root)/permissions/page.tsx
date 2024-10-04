"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
 

const Nodes = () => {

  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [description, setDescription] = useState('');
  const [scheduling, setScheduling] = useState('On demand');
  const [workflow, setWorkflow] = useState('Open');
  const [isDefaultPermission, setIsDefaultPermission] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="background background-light900_dark300 max-h-screen">
      {/* Add user/admin restrictions afterwards !  */}
      <div className="background background-light900_dark300 mx-auto  max-w-4xl rounded-lg p-6 shadow-md">
       <h2 className="h1-bold text-dark100_light900">New Permission</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">Create a new device group</p>
      
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300"
            required
          />
          <input
            type="text"
            placeholder="Abbreviation *"
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300"
            required
          />
        </div>
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-gray-300"
          rows= {4}
        />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <select
              value={scheduling}
              onChange={(e) => setScheduling(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="On demand">On demand</option>
              {/* Add other options as needed */}
            </select>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              On demand: Devices are assigned to a user as long as the card of the user is detected. As soon as the card is removed, the machine is released and available for the next user.
            </p>
          </div>
          
          <div>
            <select
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Open">Open</option>
              {/* Add other options as needed */}
            </select>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Open: Users can directly access the machine without prior approval.
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="defaultPermission"
            checked={isDefaultPermission}
            onChange={(e) => setIsDefaultPermission(e.target.checked)}
            className="mr-2 text-orange-500 "
          />
          <label htmlFor="defaultPermission" className="text-gray-700 dark:text-gray-300">
            Default permission: Users will have this permission by default and it is not required to add users explicitly. Revoking access can be done on a per-user basis.
          </label>
        </div>
        
        <div>
          <p className="mb-2 text-gray-700 dark:text-gray-300">No preview available.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            UPLOAD IMAGE *
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="rounded bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          CREATE PERMISSION
        </motion.button>
      </form>
    </div>
    </div>
  );
};

export default Nodes;
