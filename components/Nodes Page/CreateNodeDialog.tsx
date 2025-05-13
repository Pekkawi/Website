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
// import SerialNumberSelect from './SerialNumberSelect';
import PermissionsTypeSelect from './PermissionsTypeSelect';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import {
  createNodeFormData,
  createNodeFormSchema,
} from '@/zodSchemas/createNodeFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from 'react-query';
import { getPermissions } from '@/hooks/permissionHooks';
import { IPerm } from '@/interfaces/database.interfaces';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const CreateNodeDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: perms,
    status,
    refetch,
  } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
    onSuccess: (data) => {
      // Pre-populate the query cache with individual permissions
      data.forEach((perm: IPerm) => {
        queryClient.setQueryData(['permission', perm._id], perm);
      });
    },
  });

  const form = useForm<createNodeFormData>({
    resolver: zodResolver(createNodeFormSchema(perms)),
  });

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
        <Button className="fixed bottom-10 right-5 size-14 rounded-full bg-orange-500 p-0 shadow-xl transition-colors hover:bg-orange-600">
          <Plus className="size-6 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="background-light900_dark300 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900 text-xl font-semibold">
            Add New Machine
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header"> Name </FormLabel>
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
                name="type"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="form-header -top-2">Machine Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="background-light900_dark300 text-dark100_light900">
                          <SelectValue placeholder="Select a Machine Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="background-light900_dark300 text-dark100_light900">
                        {perms.map((perm: IPerm) => {
                          return (
                            <SelectItem value={perm.abbreviation} key={perm.abbreviation}>
                              {perm.abbreviation}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

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
