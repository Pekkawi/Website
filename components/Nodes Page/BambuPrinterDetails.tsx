'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { BambuPrinterNode } from '@/interfaces/nodes.interface';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Types } from 'mongoose';
import { socket } from '@/app/socket';

interface BambuPrinterNodeDetailsProps {
  node: BambuPrinterNode;
}

// shape of status updates from socket
interface PrinterStatus {
  _id: string;
  fileName?: string;
  progress?: number;
  printTime?: string;
}

const BambuControlPanelDetails: React.FC<BambuPrinterNodeDetailsProps> = ({ node }) => {
  const [printTime, setPrintTime] = useState<string>(node.totalTime ?? '???');
  const [fileName, setFileName] = useState<string>(node.fileName ?? '???');
  const [progress, setProgress] = useState<number>(0);

  const queryClient = useQueryClient(); // for delete

  useEffect(() => {
    const handleStatusUpdate = (payload: PrinterStatus | PrinterStatus[]) => {
      const statuses = Array.isArray(payload) ? payload : [payload];
      const myStatus = statuses.find((s) => s._id === node._id);
      if (!myStatus) return;
      if (myStatus.fileName !== undefined) setFileName(myStatus.fileName);
      if (myStatus.progress !== undefined) setProgress(myStatus.progress);
      if (myStatus.printTime !== undefined) setPrintTime(myStatus.printTime);
    };

    socket.on('printerStatus', handleStatusUpdate);
    return () => {
      socket.off('printerStatus', handleStatusUpdate);
    };
  }, [node._id]);

  const deleteNodeMutation = useMutation<void, Error, string>(
    (nodeId: string) =>
      fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete node');
        }
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('nodes');
      },
      onError: () => {
        console.error('Error deleting node');
      },
    }
  );

  const handleConfirmDelete = () => {
    if (node._id) {
      deleteNodeMutation.mutate(node._id);
    }
  };

  const allNodes = queryClient.getQueryData<BambuPrinterNode[]>('nodes') ?? [];
  const ownerNode = allNodes.find(
    (n) => n._id === (node.owner as Types.ObjectId).toString()
  );

  return (
    <div className="relative grid grid-cols-1 justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-3 mmd:grid-rows-1">
      <div className="col-span-1">
        <div className="mt-2">
          <h4 className="text-dark100_light900">Owner</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {ownerNode?.name ?? '???'}
          </p>
        </div>
        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">IP Address</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">{node.IP}</p>
        </div>
        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Serial Number</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {node.SerialNumber}
          </p>
        </div>
        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Access Code</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {node.accessCode ?? '???'}
          </p>
        </div>
      </div>

      <div className="col-span-1">
        <div className="mt-2">
          <h4 className="text-dark100_light900">File Name</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">{fileName}</p>
        </div>

        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Percentage</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">{progress}</p>
        </div>

        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Time Left</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">{printTime}</p>
        </div>
      </div>

      <div className="absolute bottom-5 right-10 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="rounded bg-red-600 px-3 py-1 text-base text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2"
              disabled={deleteNodeMutation.isLoading}
            >
              {deleteNodeMutation.isLoading ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogTrigger>

          <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
            <DialogHeader className="space-y-2">
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                <div className="space-y-2">
                  <p>Are you sure you want to delete this node?</p>
                  <p className="font-semibold text-red-600">
                    This action cannot be undone.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline" className="px-4 py-2">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BambuControlPanelDetails;
