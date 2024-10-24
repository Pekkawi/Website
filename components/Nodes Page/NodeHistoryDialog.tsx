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

// dummy data for the history dialog
export const data: History[] = [
  {
    name: 'Adam Eve',
    email: 'admaa@gmail.com',
    date: new Date(2024, 10, 24, 15, 30),
  },
  {
    name: 'Johnny Jones',
    email: 'jj@gmail.com',
    date: new Date(2024, 10, 23, 12, 0),
  },
  {
    name: 'Sørn Christensen',
    email: 'sochri@gmail.com',
    date: new Date(2024, 10, 23, 8, 0),
  },
];

const NodeHistoryDialog = ({ id }: { id: string }) => {
  // The passed in id represents the id of the node

  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="background-light900_dark300 text-dark100_light900 border-gray-300 px-3 py-1 text-base font-bold hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 md:py-2 xl:px-7 xl:py-2"
          >
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">History</DialogTitle>
          </DialogHeader>

          <p className="mb-4 mt-2 text-left text-sm text-gray-500 dark:text-gray-400">
            Here you can view the all the past entries in the past month
          </p>

          <HistoryTable columns={columns} data={data} />

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
