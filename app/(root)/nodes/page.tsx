'use client';

import NodeDetails from '@/components/Nodes Page/NodeDetails';
import NodeDropDown from '@/components/Nodes Page/NodeDropDown';
import { RestrictedAccess } from '@/components/shared/RestrictedAccess';
import { useUser } from '@clerk/nextjs';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

export interface nodeInterface {
  name: string;
  status: 'Ready' | 'Locked' | 'Maintenance';
  occupied: string;
  MACAddress: string;
  SerialNumber: string;
}

const data: nodeInterface[] = [
  {
    name: 'Laser Cutter 1',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'AVDE123',
    SerialNumber: '111',
  },
  {
    name: 'Bambu Printer 1',
    status: 'Maintenance',
    occupied: 'None',
    MACAddress: 'ACDW231',
    SerialNumber: '222',
  },
  {
    name: 'Bambu Printer 2',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'ASWW23',
    SerialNumber: '333',
  },
  {
    name: 'Dreamer Printer 1',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'ASWW23',
    SerialNumber: '444',
  },
  {
    name: 'Dreamer Printer 2',
    status: 'Locked',
    occupied: 'John Doe',
    MACAddress: 'ASWW23',
    SerialNumber: '555',
  },
];

const Nodes = () => {
  const { user, isLoaded } = useUser();
  const [nodeOpen, setnodeOpen] = useState(''); // initially an empty string

  // makes sure that only one drop down is opened at a time
  const handleToggle = (deviceName: string) => {
    if (deviceName === nodeOpen) {
      console.log('YO');
      setnodeOpen('');
    } else {
      console.log('SUP');
      setnodeOpen(deviceName);
    }
    console.log('Clicked on ' + deviceName);
  };

  const isAdmin = user?.publicMetadata?.role === 'Admin';

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background background-light900_dark300 mb-2 h-auto">
      {isAdmin ? (
        <>
          <h1 className="h1-bold text-dark100_light900">Nodes</h1>
          <p className="mb-3 mt-[-8px]  text-gray-500">
            Connected nodes for machine control
          </p>

          {
            // Go through all the nodes ,right now just havea dummy node
            // nodes.map((node)=>{...})  Display all nodes from the datbase
            <section className="mt-7 rounded-sm border border-gray-200 bg-white shadow-md shadow-gray-300 dark:border-dark-400 dark:bg-dark-300 dark:shadow-gray-500">
              {data.map((node: nodeInterface) => {
                return (
                  <>
                    <div key={node.name}>
                      <div onClick={() => handleToggle(node.name)}>
                        <NodeDetails
                          name={node.name}
                          status={node.status}
                          occupied={node.occupied}
                          clicked={node.name === nodeOpen}
                        />
                      </div>
                      <AnimatePresence>
                        {node.name === nodeOpen && (
                          <NodeDropDown
                            serialNumber={node.SerialNumber}
                            MACAddress={node.MACAddress}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                );
              })}
            </section>
          }
        </>
      ) : (
        <RestrictedAccess />
      )}
    </div>
  );
};

export default Nodes;
