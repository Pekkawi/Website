'use client';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusDropdown from './NodeStatus';

const NodeDetails = ({
  name,
  occupied,
  status,
  clicked,
}: {
  name: string;
  occupied: string;
  status: 'Ready' | 'Maintenance' | 'Locked';
  clicked: boolean;
}) => {
  return (
    <div className={`w-full ${!clicked && 'border-b-2 border-gray-200'}`}>
      <div className="flex cursor-pointer items-center px-6 py-4">
        {/* Status Indicator */}
        <div className="mr-6 shrink-0">
          <div
            className={`size-6 rounded-full ${status === 'Ready' ? 'bg-green-500' : `${status === 'Locked' ? 'bg-red-500' : 'bg-orange-400'}`}`}
          />
        </div>

        {/* Name Section */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Name</h4>
          <p className="text-sm text-gray-400">{name}</p>
        </div>

        {/* Current User Section */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">Current User</h4>
          <p className="text-sm text-gray-400">{occupied}</p>
        </div>

        {/* Status Dropdown */}
        <div className="flex-1">
          <StatusDropdown status={status} index={1} />
        </div>

        {/* Chevron */}

        <motion.span
          className={`ml-4 shrink-0 text-gray-400`}
          initial={{ rotate: 0 }}
          animate={{ rotate: clicked ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-6" />
        </motion.span>
      </div>
    </div>
  );
};

export default NodeDetails;
