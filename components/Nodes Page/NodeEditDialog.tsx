'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { BambuNodeEditData, BambuNodeEditSchema } from '@/zodSchemas/BambuNodeEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { updateNodeSettings } from '@/hooks/nodeHooks';

// dummy data for the history dialog

const NodeEditDialog = ({
  nodeId,
  nodeName,
  IP,
  SerialNumber,
  accessCode,
}: {
  nodeId: string;
  nodeName: string;
  IP: string;
  SerialNumber: string;
  accessCode: string;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<BambuNodeEditData>({
    resolver: zodResolver(BambuNodeEditSchema),
    defaultValues: {
      name: nodeName,
      IP,
      SerialNumber,
      accessCode,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: nodeName,
        IP,
        SerialNumber,
        accessCode,
      });
    }
  }, [nodeName, IP, SerialNumber, accessCode, form, open]);

  const UpdateNodeSettingsMutation = useMutation(
    async (formData: any) => {
      return updateNodeSettings(nodeId, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('nodes');
        setOpen(false);
        form.reset();
      },
    }
  );

  const handleSubmit = (formData: any) => {
    UpdateNodeSettingsMutation.mutate(formData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="background-light900_dark300 text-dark100_light900 border-gray-300 px-3 py-1 text-base  hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 md:py-2 xl:px-7 xl:py-2"
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="background-light900_dark300 max-h-[800px] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle className="font-semibold">Edit Node </DialogTitle>
            <DialogDescription className=" mt-2 text-left text-sm text-gray-500 dark:text-gray-400">
              {' '}
              Here you can change the connection settings of a node.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header -top-2">Node Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                    <FormLabel className="form-header -top-2">IP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                    <FormLabel className="form-header -top-2">Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                    <FormLabel className="form-header -top-2">Access Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="background-light900_dark300 text-dark100_light900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  className="font-bold"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                  disabled={UpdateNodeSettingsMutation.isLoading}
                >
                  {UpdateNodeSettingsMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin text-white" />
                      Updating...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NodeEditDialog;
