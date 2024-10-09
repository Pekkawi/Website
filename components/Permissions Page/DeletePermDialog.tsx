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

const DeletePermissionDialog = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className=" rounded-full p-2 duration-150 hover:bg-gray-100">
            <Trash className="size-5 bg-cover text-gray-400 hover:cursor-pointer " />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle> Delete Permissions </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletePermissionDialog;
