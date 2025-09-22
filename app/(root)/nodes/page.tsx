'use client';

import BambuControlPanelDetails from '@/components/Nodes Page/BambuControlPanelDetails';
import BambuPrinterDetails from '@/components/Nodes Page/BambuPrinterDetails';
import CreateNodeDialog from '@/components/Nodes Page/CreateNodeDialog';
import LaserNodeDetails from '@/components/Nodes Page/LaserNodeDetails';
import NodeDetails from '@/components/Nodes Page/NodeDetails';
import PageLoader from '@/components/shared/PageLoader';
import { getNodes } from '@/hooks/nodeHooks';
import {
  BambuControlPanelNode,
  BambuPrinterNode,
  LaserNode,
  NodeType,
} from '@/interfaces/nodes.interface';
// import { RestrictedAccess } from '@/components/shared/RestrictedAccess';
// import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const Nodes = () => {
  const [nodeOpen, setnodeOpen] = useState(''); // initially an empty string
  const { data: session, status } = useSession();
  // makes sure that only one drop down is opened at a time
  const handleToggle = (deviceName: string) => {
    if (deviceName === nodeOpen) {
      setnodeOpen('');
    } else {
      setnodeOpen(deviceName);
    }
  };

  const { data: nodes = [], status: statusNodes } = useQuery('nodes', getNodes, {
    staleTime: Infinity,
  });

  if (status === 'loading') {
    return <PageLoader />;
  }

  if (statusNodes === 'loading') {
    return <PageLoader />;
  }
  if (session?.user?.role === 'Admin') {
    return (
      <div className="background background-light900_dark300 mb-2 h-auto mt-[-30px]">
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
              <section className="mt-7 rounded-sm border border-gray-200 bg-white shadow-md shadow-gray-300 dark:border-gray-400 dark:bg-gray-300 dark:shadow-gray-500">
                {nodes.map((node: NodeType) => {
                  return (
                    <div key={node._id}>
                      <div onClick={() => handleToggle(node._id)}>
                        <NodeDetails
                          name={node.name}
                          status={node.Status}
                          occupied={node.occupiedBy}
                          clicked={node._id === nodeOpen}
                          nodeId={node._id}
                        />
                      </div>
                      <AnimatePresence>
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
                          {/* Depending on the discriminator key (__t), render the correct detail component */}
                          {node.__t === 'Laser Cutter' && node._id === nodeOpen && (
                            <LaserNodeDetails node={node as LaserNode} />
                          )}
                          {node.__t === 'Bambu Printer' && node._id === nodeOpen && (
                            <BambuPrinterDetails node={node as BambuPrinterNode} />
                          )}
                          {node.__t === 'Bambu Control Panel' &&
                            node._id === nodeOpen && (
                              <BambuControlPanelDetails
                                node={node as BambuControlPanelNode}
                              />
                            )}
                          {/* {node._id === nodeOpen && (
                        <NodeDropDown
                          serialNumber={node.SerialNumber}
                          MACAddress={node.MACAddress}
                        />
                      )} */}
                        </motion.div>
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
  } else {
    return (
      <>
        <h1> Hey you are not allowed to be here...</h1>
      </>
    );
  }
};

export default Nodes;
