'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { columns } from './NodeHistoryColumns';
import { HistoryTable } from './NodeHistoryTable';

// dummy data for the history dialog

const NodeHistoryDialog = ({ nodeId }: { nodeId: string }) => {
  // The passed in id represents the id of the node

  const [open, setOpen] = useState(false);

  //   const { data: rawHistory, status: statusNodeHistory } = useQuery<{
  //     nodeHistory: any[];
  //   }>(['nodeHistory', nodeId], () => getNodeHistory(nodeId), {
  //     staleTime: 400,
  //   });

  //   function castNodeHistoryData(
  //     uncastedNodeHistory: { nodeHistory: any[] } | undefined
  //   ): History[] {
  //     if (!uncastedNodeHistory || !Array.isArray(uncastedNodeHistory.nodeHistory)) {
  //       return [];
  //     }

  //     const soka = uncastedNodeHistory.nodeHistory.map((item: any) => ({
  //       name: item.user?.display_name ?? '',
  //       email: item.user?.email ?? '',
  //       fileName: item.fileName ?? '',
  //       date: item.timeStamp instanceof Date ? item.timeStamp : new Date(item.timeStamp),
  //     }));

  //     return soka;
  //   }

  //   if (statusNodeHistory === 'loading') {
  //     // return <LoaderComponent />;
  //   }

  //   if (statusNodeHistory === 'error') {
  //     // return <ErrorFetchingComponent/>
  //   }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="background-light900_dark300 text-dark100_light900 border-gray-300 px-3 py-1 text-base  hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 md:py-2 xl:px-7 xl:py-2"
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 max-h-[800px] overflow-y-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">History</DialogTitle>
            <DialogDescription className=" mt-2 text-left text-sm text-gray-500 dark:text-gray-400">
              {' '}
              Here you can edit the connectivity and order number of a node
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold"
              onClick={() => setOpen(false)}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NodeHistoryDialog;
