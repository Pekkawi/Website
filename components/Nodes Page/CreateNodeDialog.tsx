'use client';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import SerialNumberSelect from './SerialNumberSelect';
import PermissionsTypeSelect from './PermissionsTypeSelect';

const CreateNodeDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-10 right-14 size-14 rounded-full bg-orange-500 p-0 shadow-xl transition-colors hover:bg-orange-600">
          <Plus className="size-6 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900 text-xl font-semibold">
            Add New Machine
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="relative">
            <div className="absolute -top-2 left-2 z-[1] bg-white px-1 text-xs text-gray-700 dark:bg-dark-300 dark:text-gray-400">
              Machine name
            </div>
            <Input
              id="name"
              placeholder="Enter name"
              className="background-light900_dark300 text-dark100_light900 border-2 border-gray-300 px-3 py-2 hover:border-gray-400 focus:border-blue-500 focus:ring-white dark:border-gray-600 dark:hover:border-gray-500 dark:focus:ring-black"
            />
          </div>

          <SerialNumberSelect />
          <PermissionsTypeSelect />
        </div>

        <DialogFooter className="mt-8">
          <Button
            variant="outline"
            className="font-medium"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-orange-500 font-medium text-white transition-colors hover:bg-orange-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              'Create Node'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNodeDialog;
