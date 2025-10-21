import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { deleteUserCredentials } from '@/hooks/userCredentialsHook';

const DeleteUserCredentialDialog = ({
  credId,
  disabled = false,
}: {
  credId: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteUserCredentialPermutation = useMutation(
    (userCredId: string) => deleteUserCredentials(userCredId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userCredentials');
        setOpen(false);
      },
    }
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div
            className={`rounded-full p-2 duration-150 ${
              disabled
                ? 'cursor-not-allowed opacity-50' // Disabled styles
                : 'hover:cursor-pointer hover:bg-gray-100' // Active styles
            }`}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault(); // Crucial: Prevents the dialog from opening
              }
            }}
            title={disabled ? 'You cannot delete your own account' : 'Delete User'} // Tooltip for UX
          >
            <Trash
              className={`size-5 text-gray-400  ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}`}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">Delete User Credential</DialogTitle>
          </DialogHeader>

          <p className="mb-4 mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want anihilate this person? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded bg-red-600 font-bold text-white hover:bg-red-700"
              onClick={() => deleteUserCredentialPermutation.mutate(credId)}
              disabled={deleteUserCredentialPermutation.isLoading}
            >
              {deleteUserCredentialPermutation.isLoading ? (
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
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteUserCredentialDialog;
