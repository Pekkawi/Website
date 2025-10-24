'use client';

import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
import NodeHistoryDialog from './NodeHistoryDialog';

type Status = 'Maintenance' | 'Free' | 'Occupied' | 'Disconnected' | 'Paused';

interface BambuPrinterNodeDetailsProps {
  node: BambuPrinterNode;
}

interface PrinterStatus {
  printTime: string;
  fileName: string;
  progress: number;
  status: Status;
}

const BambuControlPanelDetails: React.FC<BambuPrinterNodeDetailsProps> = ({ node }) => {
  const queryClient = useQueryClient();

  // Initial fallback values taken from node props
  const initialStatus: PrinterStatus = {
    printTime: node.totalTime ?? '???',
    fileName: node.fileName ?? '???',
    progress: 0,
    status: 'Free',
  };

  const formatTime = (time: string | number): string => {
    const totalMinutes = typeof time === 'number' ? time : parseInt(time.toString(), 10);
    if (isNaN(totalMinutes)) return time.toString();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} h ${minutes} min`;
  };

  // Keep cache updated when socket emits
  useEffect(() => {
    const handleStatusUpdate = (payload: any | any[]) => {
      const statuses = Array.isArray(payload) ? payload : [payload];
      const myStatus = statuses.find((s) => s._id === node._id);
      if (!myStatus) return;
      queryClient.setQueryData<PrinterStatus>(['printerStatus', node._id], (old) => ({
        printTime:
          myStatus.status === 'Free'
            ? '???'
            : (myStatus.printTime ?? initialStatus.printTime),

        fileName:
          myStatus.status === 'Free'
            ? '???'
            : (myStatus.fileName ?? initialStatus.fileName),
        progress:
          myStatus.status === 'Free' ? 0 : (myStatus.progress ?? initialStatus.progress),
        status: myStatus.status ?? initialStatus.status,
        // printTime: myStatus.printTime ?? old?.printTime ?? initialStatus.printTime,
        // fileName: myStatus.fileName ?? old?.fileName ?? initialStatus.fileName,
        // progress: myStatus.progress ?? old?.progress ?? initialStatus.progress,
      }));
    };
    socket.on('connect_error', (err) => {
      console.log('Message: ', err.message);

      console.log('Error Cause:', err.cause);

      console.log('Error Stack: ', err.stack);
    });
    socket.on('printerStatus', handleStatusUpdate);
    return () => {
      socket.off('printerStatus', handleStatusUpdate);
    };
  }, [
    node._id,
    queryClient,
    initialStatus.printTime,
    initialStatus.fileName,
    initialStatus.progress,
    initialStatus.status,
  ]);

  // Retrieve live status from global cache (or initial fallback)
  const { data: status } = useQuery<PrinterStatus>(
    ['printerStatus', node._id],
    () =>
      (queryClient.getQueryData(['printerStatus', node._id]) as PrinterStatus) ??
      initialStatus,
    {
      initialData: initialStatus,
      staleTime: Infinity,
    }
  );

  // Delete mutation
  const deleteNodeMutation = useMutation<void, Error, string>(
    (nodeId) =>
      fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' }).then((res) => {
        if (!res.ok) throw new Error('Failed to delete node');
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('nodes'),
      onError: () => console.error('Error deleting node'),
    }
  );

  const handleConfirmDelete = () => {
    if (node._id) deleteNodeMutation.mutate(node._id);
  };

  const allNodes = queryClient.getQueryData<BambuPrinterNode[]>('nodes') ?? [];
  const ownerNode = allNodes.find(
    (n) => n._id === (node.owner as Types.ObjectId).toString()
  );

  return (
    <div className="relative grid grid-cols-1 justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-3 mmd:grid-rows-1">
      {/* LEFT COLUMN */}
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

      {/* RIGHT COLUMN – live status */}
      <div className="col-span-1">
        <div className="mt-2">
          <h4 className="text-dark100_light900">File Name</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {status?.fileName}
          </p>
        </div>
        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Percentage</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {status?.progress}%
          </p>
        </div>
        <div className="mb-5 mt-6">
          <h4 className="text-dark100_light900">Time Left</h4>
          <p className="font-extralight text-gray-400 dark:text-gray-600">
            {formatTime(status?.printTime || 0)}
          </p>
        </div>
      </div>

      {/* BUTTON SECTION BELLOW THE DIV (Dialogs) */}
      <div className="absolute bottom-5 right-10 flex gap-2">
        {/* <EditNodeDialog nodeId={node._id} /> */}

        <NodeHistoryDialog nodeId={node._id} />

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
