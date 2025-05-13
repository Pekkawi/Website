'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { BambuNodeFormData, BambuNodeFormSchema } from '@/zodSchemas/BambuNodeFormSchema';

// updating permission API route

type InitialDataType = {
  name: string;
  accessCode: string;
  serialNumber: string;
  IP: string;
};

const EditConnection = ({ initialData }: { initialData: InitialDataType }) => {
  const [open, setOpen] = useState(false);
  // const [isDialogOpen, setDialogOpen] = useState(false);

  // const queryClient = useQueryClient();

  const form = useForm<BambuNodeFormData>({
    resolver: zodResolver(BambuNodeFormSchema),
    defaultValues: {
      name: initialData.name,
      IP: initialData.IP,
      SerialNumber: initialData.serialNumber,
      accessCode: initialData.accessCode,
    },
  });

  // Update local state when data prop changes

  useEffect(() => {
    if (open) {
      // Only update when dialog is open
      form.reset({
        name: initialData.name,
        IP: initialData.IP,
        SerialNumber: initialData.serialNumber,
        accessCode: initialData.accessCode,
      });
    }
  }, [initialData, open, form]); // Add initialData and open to dependencies

  const handleDialogChange = (Open: boolean) => {
    setOpen(Open);

    // If dialog is being closed, reset states after animation
    if (!Open) {
      // Wait for dialog close animation (300ms is standard for shadcn/ui before resseting form)
      setTimeout(() => {
        // setCroppedImage(null);
        // setSelectedFile(null);
        // setCurrentImage(initialData.image.toString());
        // form.reset({
        //   name: initialData.name,
        //   abbreviation: initialData.abbreviation,
        //   description: initialData.description,
        //   scheduling:
        //     initialData.scheduling === 'scheduled' ? 'on_demand' : initialData.scheduling,
        //   permission: initialData.default ? 'default' : 'special',
        //   image: initialData.image,
        // });
      }, 300);
    }
  };

  // UPDATE MUTATION (EXECUTES WHEN FORM IS SUBMITTED)
  const updatePermMutation = useMutation(async (formData: any) => {}, {
    onSuccess: () => {
      // Invalidate query and refetch data
      // queryClient.invalidateQueries('permissions');
      // setOpen(false);
      // form.reset();
      // setCroppedImage(null);
      // setSelectedFile(null);
    },
  });

  // Handling submission
  const handleSubmit: SubmitHandler<BambuNodeFormData> = (data) => {
    updatePermMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100">
          <Pencil className="size-5 text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="background-light900_dark300 max-h-fit sm:max-w-[425px]"
        // Prevent autofocus on an element when dialog closes (prevents default behavior)
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        // Prevent default behavior when pressing ESC and insteaqd enter the dialog handle function
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          handleDialogChange(false);
        }}
        // Prevent default behavior when pressing outside the dialog and instead enter the dialog handle function
        onInteractOutside={(event) => {
          event.preventDefault();
          handleDialogChange(false);
        }}
        // Prevent autofocus on an element when dialog opens (prevents default behavior
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-semibold">Edit Connection</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={initialData.name}
                        className="background-light900_dark300 text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="IP"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header">IP Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={initialData.IP}
                        className="background-light900_dark300 text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="SerialNumber"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header">Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={initialData.serialNumber}
                        className="background-light900_dark300 text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header">Access Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={initialData.accessCode}
                        className="background-light900_dark300 text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="font-bold"
                onClick={() => handleDialogChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                disabled={updatePermMutation.isLoading}
              >
                {updatePermMutation.isLoading ? (
                  <>
                    <svg
                      className="-ml-1 mr-3 size-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditConnection;
