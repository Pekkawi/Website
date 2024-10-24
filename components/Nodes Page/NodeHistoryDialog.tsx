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
    name: 'Emma Thompson',
    email: 'emma.t@gmail.com',
    date: new Date(2024, 10, 24, 23, 45),
  },
  {
    name: 'Liu Wei',
    email: 'l.wei@gmail.com',
    date: new Date(2024, 10, 24, 22, 30),
  },
  {
    name: 'Marcus Anderson',
    email: 'manderson@gmail.com',
    date: new Date(2024, 10, 24, 21, 15),
  },
  {
    name: 'Sofia Rodriguez',
    email: 'srodri@gmail.com',
    date: new Date(2024, 10, 24, 20, 0),
  },
  {
    name: 'Yuki Tanaka',
    email: 'ytanaka@gmail.com',
    date: new Date(2024, 10, 24, 18, 45),
  },
  {
    name: 'Hassan Ali',
    email: 'hali@gmail.com',
    date: new Date(2024, 10, 24, 17, 30),
  },
  {
    name: 'Clara Schmidt',
    email: 'c.schmidt@gmail.com',
    date: new Date(2024, 10, 24, 16, 15),
  },
  {
    name: 'Oscar Nielsen',
    email: 'o.nielsen@gmail.com',
    date: new Date(2024, 10, 24, 15, 0),
  },
  {
    name: 'Priya Patel',
    email: 'ppatel@gmail.com',
    date: new Date(2024, 10, 24, 13, 45),
  },
  {
    name: 'Antoine Dubois',
    email: 'adubois@gmail.com',
    date: new Date(2024, 10, 24, 12, 30),
  },
  {
    name: 'Maya Johnson',
    email: 'mjohnson@gmail.com',
    date: new Date(2024, 10, 24, 11, 15),
  },
  {
    name: 'Lars Andersen',
    email: 'landersen@gmail.com',
    date: new Date(2024, 10, 24, 10, 0),
  },
  {
    name: 'Isabella Santos',
    email: 'i.santos@gmail.com',
    date: new Date(2024, 10, 24, 8, 45),
  },
  {
    name: 'Aleksander Kowalski',
    email: 'akowal@gmail.com',
    date: new Date(2024, 10, 24, 7, 30),
  },
  {
    name: 'Nina Chen',
    email: 'nchen@gmail.com',
    date: new Date(2024, 10, 24, 6, 15),
  },
  {
    name: 'Mohammed Ahmed',
    email: 'm.ahmed@gmail.com',
    date: new Date(2024, 10, 24, 5, 0),
  },
  {
    name: "Sarah O'Connor",
    email: 'soconnor@gmail.com',
    date: new Date(2024, 10, 24, 3, 45),
  },
  {
    name: 'Kim Min-ji',
    email: 'kmj@gmail.com',
    date: new Date(2024, 10, 24, 2, 30),
  },
  {
    name: 'Gabriel Silva',
    email: 'gsilva@gmail.com',
    date: new Date(2024, 10, 24, 1, 15),
  },
  {
    name: 'Anastasia Popov',
    email: 'apopov@gmail.com',
    date: new Date(2024, 10, 24, 0, 0),
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
