'use client';

import CreateNodeDialog from '@/components/Nodes Page/CreateNodeDialog';
import NodeDetails from '@/components/Nodes Page/NodeDetails';
import NodeDropDown from '@/components/Nodes Page/NodeDropDown';
// import { RestrictedAccess } from '@/components/shared/RestrictedAccess';
// import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

export interface nodeInterface {
  name: string;
  status: 'Ready' | 'Locked' | 'Maintenance';
  occupied: string;
  MACAddress: string;
  SerialNumber: string;
}

const data: nodeInterface[] = [
  // 3D Printers - Bambu Lab
  {
    name: 'Bambu X1C-1',
    status: 'Ready',
    occupied: 'None',
    MACAddress: '00:1B:44:11:3A:B7',
    SerialNumber: 'BX1C2401-0584',
  },
  {
    name: 'Bambu X1C-2',
    status: 'Maintenance',
    occupied: 'None',
    MACAddress: '00:1B:44:11:3A:C8',
    SerialNumber: 'BX1C2401-0585',
  },
  {
    name: 'Laser Cutter 1',
    status: 'Locked',
    occupied: 'Pablo Perez',
    MACAddress: '00:1B:44:12:4B:D9',
    SerialNumber: 'BP1P2312-1024',
  },

  // 3D Printers - Prusa
  {
    name: 'Prusa MK4-1',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'B8:27:EB:AA:BB:CC',
    SerialNumber: 'PMK4-2023-2584',
  },
  {
    name: 'Prusa MK4-2',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'B8:27:EB:AA:BB:CD',
    SerialNumber: 'PMK4-2023-2585',
  },

  // Laser Cutters

  {
    name: 'Glowforge Pro-1',
    status: 'Locked',
    occupied: 'Emma Smith',
    MACAddress: 'A4:C3:F0:85:7B:D3',
    SerialNumber: 'GFPRO-2024-0140',
  },

  // CNC Machines
  {
    name: 'Snapmaker 2-1',
    status: 'Ready',
    occupied: 'None',
    MACAddress: 'CC:50:E3:2D:9A:B1',
    SerialNumber: 'SM2A350-2401-0892',
  },
];

const Nodes = () => {
  // const { user, isLoaded } = useUser();
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

  // const isAdmin = user?.publicMetadata?.role === 'Admin';

  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="background background-light900_dark300 mb-2 h-auto">
      <>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="h1-bold text-dark100_light900">Machines</h1>
          <p className="mb-3 mt-[-8px]  text-gray-500">
            Connected machines in the network
          </p>

          {
            // Go through all the nodes ,right now just havea dummy node
            // nodes.map((node)=>{...})  Display all nodes from the datbase
            <section className="mt-7 rounded-sm border border-gray-200 bg-white shadow-md shadow-gray-300 dark:border-dark-400 dark:bg-dark-300 dark:shadow-gray-500">
              {data.map((node: nodeInterface) => {
                return (
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
                );
              })}
            </section>
          }
        </motion.div>
        <CreateNodeDialog />
      </>
    </div>
  );
};

export default Nodes;
