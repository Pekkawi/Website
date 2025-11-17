import { DialogDescription } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { columns } from './UserHistoryColumns';
import { UserHistoryTable } from './UserHistoryTable';
import type { History } from './UserHistoryColumns'; // 👈 ensures same exact type
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getUserHistory } from '@/hooks/historyHooks';

const UserHistoryDialog = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);

  const { data: rawHistory, status: statusNodeHistory } = useQuery<{
    userHistory: any[];
  }>(['nodeHistory', userId], () => getUserHistory(userId), {
    staleTime: 400,
  });

  function castUserHistoryData(
    uncastedUserHistory: { userHistory: any[] } | undefined
  ): History[] {
    if (!uncastedUserHistory || !Array.isArray(uncastedUserHistory.userHistory)) {
      return [];
    }

    const data = uncastedUserHistory.userHistory.map((item: any) => ({
      node_name: item.node?.name ?? '',
      fileName: item.fileName ?? 'None',
      date: item.timeStamp instanceof Date ? item.timeStamp : new Date(item.timeStamp),
    }));

    return data;
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
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="background-light900_dark300 text-dark100_light900  border-gray-300 px-3 py-1 text-base  hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 md:py-2 xl:px-7 xl:py-2"
          >
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 max-h-[800px] overflow-y-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-semibold"> History</DialogTitle>
            <DialogDescription className=" mt-2 text-left text-sm text-gray-500 dark:text-gray-400">
              Here you can view the all the past entries within a month.
            </DialogDescription>
          </DialogHeader>

          <UserHistoryTable columns={columns} data={castUserHistoryData(rawHistory)} />
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
export default UserHistoryDialog;
