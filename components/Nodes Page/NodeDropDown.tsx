import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import NodeHistoryDialog from './NodeHistoryDialog';

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
            <h4 className="text-dark100_light900">Serial Number</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {serialNumber}
            </p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">MAC Address</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {MACAddress}
            </p>
          </div>
        </div>

        <div className="justify-self-start col-span-2">
          {/* To be added when node is finished */}
          <div className="mt-2">
            <h4 className="text-dark100_light900">Created</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">2 days ago</p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">Blink LED</h4>
            <Switch className="background-light900_dark300 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700 [&_span[data-state]]:bg-white" />{' '}
          </div>
        </div>

        <div className="absolute bottom-5 right-10 flex gap-2">
          <NodeHistoryDialog id={serialNumber} />
          <Button className=" rounded bg-red-600 px-3 py-1 text-base font-bold text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2">
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NodeDropDown;
