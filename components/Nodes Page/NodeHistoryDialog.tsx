'use client';

import { Trash } from 'lucide-react';
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
import { useMutation, useQueryClient } from 'react-query';
import { Types } from 'mongoose';
import { deletePermission } from '@/hooks/permissionHooks';

const NodeHistoryDialog = ({ id }: { id: string }) => {
  // The passed in id represents the id of the node

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const deletePermMutation = useMutation(
    (permissionId: Types.ObjectId) => deletePermission(permissionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('permissions');
        setOpen(false);
      },
    }
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            variant="outline"
            className="font-bold px-3 py-1 text-base background-light900_dark300 text-dark100_light900 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 md:py-2 xl:px-7 xl:py-2"
          >
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">Delete Permissions</DialogTitle>
          </DialogHeader>

          <p className="mb-4 mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this permission? This action cannot be undone.
          </p>

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
