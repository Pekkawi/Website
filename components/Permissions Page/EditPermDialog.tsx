'use client';

import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Types } from 'mongoose';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import EditPermissionFormDialog from './EditPermissionFormDialog';

const EditPermissionDialog = ({ permId }: { permId: Types.ObjectId }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const editPermissionMutation = useMutation(
    (permissionId: Types.ObjectId) => editPermission(permissionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('permissions'); // invalidate permissions
        setOpen(false);
      },
    }
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className=" rounded-full p-2 duration-150 hover:bg-gray-100">
            <Pencil className="size-5 text-gray-400 hover:cursor-pointer " />
          </div>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> Edit Permissions </DialogTitle>
          </DialogHeader>
          <EditPermissionFormDialog />
          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="bg-orange-500 font-semibold text-white"
              onClick={() => handleEditing()}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPermissionDialog;
