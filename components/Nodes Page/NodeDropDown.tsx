import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import NodeHistoryDialog from './NodeHistoryDialog';
import EditConnection from './EditConnection';

const NodeDropDown = ({
  serialNumber,
  MACAddress,
}: {
  serialNumber: string;
  MACAddress: string;
}) => {
  return (
    <motion.div
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: 'auto' },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative overflow-hidden  border-b-2 border-gray-200"
    >
      <div className="relative grid grid-cols-1 justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-3 mmd:grid-rows-1">
        <div className="col-span-1">
          <div className="mt-2">
            <h4 className="text-dark100_light900">MAC Address</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {serialNumber}
            </p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">IP Address</h4>
            <div className="-mb-4 flex items-center justify-between">
              <p className="font-extralight text-gray-400 dark:text-gray-600">
                10.126.128.24
              </p>
              <EditConnection
                initialData={{
                  name: 'Printer 1',
                  accessCode: '12345678',
                  serialNumber: 'SN1234123451234',
                  IP: '192.168.101.1',
                }}
              />
            </div>
          </div>

          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">File Name</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">ceva.3mf</p>
          </div>
        </div>

        <div className="col-span-2 justify-self-start">
          {/* To be added when node is finished */}

          <div className="mt-2">
            <h4 className="text-dark100_light900">Total Time</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">1h36min</p>
          </div>

          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">Time Left</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">5h21min</p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">Material</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">???</p>
          </div>
        </div>

        <div className="absolute bottom-5 right-10 flex gap-2">
          <NodeHistoryDialog id={serialNumber} />
          <Button className=" rounded bg-red-600 px-3 py-1 text-base  text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2">
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NodeDropDown;
