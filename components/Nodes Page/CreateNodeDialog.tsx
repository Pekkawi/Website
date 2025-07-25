'use client';
import { Circle, Plus } from 'lucide-react';
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
import { useMemo, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  createNodeFormData,
  createNodeFormSchema,
} from '@/zodSchemas/createNodeFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPermissions } from '@/hooks/permissionHooks';
import { IDevice, IPerm } from '@/interfaces/database.interfaces';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Loader from './Loader';
import { getDevices } from '@/hooks/deviceHooks';
import clsx from 'clsx';
import { NodeType } from '@/interfaces/nodes.interface';
import { getNodes } from '@/hooks/nodeHooks';

const CreateNodeDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data: perms = [] } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
  });

  const { data: devices = [] } = useQuery('devices', getDevices, {
    staleTime: Infinity,
  });

  const { data: nodes = [] } = useQuery('nodes', getNodes, {
    staleTime: Infinity,
  });

  const controlPanels = useMemo(() => {
    return nodes.filter((node: NodeType) => {
      // Assume each node has a `.permission` object with `abbreviation` and `_id`
      const perm = node.permission;
      if (!perm) return false;

      return perm.toString() === '682dd93042e8a66e632744d5'; // hard coded value for the _id of the Bambu Control Panel in the db
    });
  }, [nodes]);

  const schema = useMemo(() => createNodeFormSchema(perms, devices), [perms, devices]);

  const form = useForm<createNodeFormData>({
    resolver: zodResolver(schema),
  });

  const selectedType = form.watch('type');

  const addNewNodeMutation = useMutation(
    (data: createNodeFormData) => submitNodeForm(data),
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries('nodes');
        queryClient.invalidateQueries('devices');
        setIsSubmitting(false);
        setOpen(false);
        form.reset();
      },
      onError: () => {
        setIsSubmitting(false);
      },
    }
  );

  const submitNodeForm = async (formData: createNodeFormData) => {
    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create node');

      form.reset();
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  const handleSubmit: SubmitHandler<createNodeFormData> = (data) => {
    addNewNodeMutation.mutate(data);
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
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Type Select */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Machine Type" />
                    </SelectTrigger>
                    <SelectContent className="background-light900_dark300">
                      {perms.map((perm: IPerm) => (
                        <SelectItem key={perm.abbreviation} value={perm.abbreviation}>
                          {perm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Conditional Fields for BAM */}
            {selectedType === 'BAM' && (
              <>
                <FormField
                  control={form.control}
                  name="IP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="SerialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Control-panel owner</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a control panel" />
                        </SelectTrigger>
                        <SelectContent className="background-light900_dark300">
                          {controlPanels.map((panel: NodeType) => (
                            <SelectItem key={panel._id} value={panel.name}>
                              {panel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Conditional Field for BCP */}
            {selectedType === 'BCP' && (
              <FormField
                control={form.control}
                name="Device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a device" />
                      </SelectTrigger>
                      <SelectContent className="background-light900_dark300">
                        {devices.map((device: IDevice) => {
                          const inUse = Boolean(device.node);

                          return (
                            <SelectItem
                              key={device.serial_number}
                              value={device.serial_number}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>
                                  {device.serial_number} · {device.application_name}
                                </span>

                                {/* status dot */}
                                <Circle
                                  fill="currentColor"
                                  className={clsx(
                                    'size-3 shrink-0',
                                    inUse ? 'text-red-500' : 'text-green-500'
                                  )}
                                />
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}

            {/* Conditional Field for LAS */}
            {selectedType === 'LAS' && (
              <FormField
                control={form.control}
                name="Device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a device" />
                      </SelectTrigger>
                      <SelectContent className="background-light900_dark300">
                        {devices.map((device: IDevice) => {
                          const inUse = Boolean(device.node);

                          return (
                            <SelectItem
                              key={device.serial_number}
                              value={device.serial_number}
                            >
                              <div className="flex w-full items-center justify-between gap-3">
                                <span className="truncate">
                                  {device.serial_number} · {device.application_name}
                                </span>

                                {/* status dot */}
                                <Circle
                                  fill="currentColor"
                                  className={clsx(
                                    'size-3 shrink-0',
                                    inUse ? 'text-red-500' : 'text-green-500'
                                  )}
                                />
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 font-medium text-white hover:bg-orange-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader />
                    Creating...
                  </>
                ) : (
                  'Create Node'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNodeDialog;
