'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { columns, History } from './NodeHistoryColumns';
import { HistoryTable } from './NodeHistoryTable';
import { Types } from 'mongoose';
import { useQuery } from 'react-query';
import { getNodeHistory } from '@/hooks/historyHooks';

// dummy data for the history dialog

const NodeHistoryDialog = ({ nodeId }: { nodeId: Types.ObjectId }) => {
  // The passed in id represents the id of the node

  const [open, setOpen] = useState(false);

  const { data: rawHistory, status: statusNodeHistory } = useQuery<any[]>(
    ['nodeHistory', nodeId],
    () => getNodeHistory(nodeId),
    {
      staleTime: 400,
    }
  );

  function castNodeHistoryData(uncastedNodeHistory: any[] | undefined): History[] {
    console.log('Do you even go into it?');

    if (!uncastedNodeHistory || !Array.isArray(uncastedNodeHistory.nodeHistory)) {
      return [];
    }

    console.log('MIKASA?');

    console.log(uncastedNodeHistory.nodeHistory);

    const soka = uncastedNodeHistory.nodeHistory.map((item: any) => ({
      name: item.user?.display_name ?? '',
      email: item.user?.email ?? '',
      fileName: item.fileName ?? '',
      date: item.timeStamp instanceof Date ? item.timeStamp : new Date(item.timeStamp),
    }));

    console.log('Casted shit:', soka);
    return soka;
  }

  if (statusNodeHistory === 'loading') {
    // return <LoaderComponent />;
  }

  if (statusNodeHistory === 'error') {
    // return <ErrorFetchingComponent/>
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="background-light900_dark300 text-dark100_light900 border-gray-300 px-3 py-1 text-base  hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 md:py-2 xl:px-7 xl:py-2"
          >
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 max-h-[800px] overflow-y-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">History</DialogTitle>
          </DialogHeader>

          <p className="mb-4 mt-2 text-left text-sm text-gray-500 dark:text-gray-400">
            Here you can view the all the past entries in the past month
          </p>

          <HistoryTable columns={columns} data={castNodeHistoryData(rawHistory)} />

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
