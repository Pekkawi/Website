'use client';

import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { useState } from 'react';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// The fields that the Form on the permissions page will take
const permissionFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 charachters')
    .max(30, 'Name must be less than 30 charachters'),
  abbreviation: z
    .string()
    .length(3, 'Abbreviation must be exactly 3 charachters')
    .refine(
      (value) => value === value.toUpperCase(),
      'Abbreviation must be uppercase'
    ),
  description: z
    .string()
    .max(200, 'Description must be less than 200 charachters')
    .optional(),
  scheduling: z
    .enum(['on_demand', 'locking'])
    .refine(
      (value) => value === 'on_demand' || value === 'locking',
      'Scheduling must be either "on_demand" or "locking"'
    ),
  image: z // workaround for file input as zod doesn't support file inputs
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max image size is 5MB'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg , .jpeg , .png and .webp formats are supported'
    ),
  permission: z
    .enum(['open', 'special_permission'])
    .refine(
      (value) => value === 'open' || value === 'special_permission',
      'Permission must be either "open" or "special_permission"'
    ),

  //workflow not added as everything was set to "Open" and the meaning of it is lost but it still is in the DB collection
});

const checkFileInfo = () => {};

const PermissionsForm = () => {
  const [fileInfo, setFileInfo] = useState<string | null>(null);

  const form = useForm<z.infer<typeof permissionFormSchema>>({
    resolver: zodResolver(permissionFormSchema), // revalidates our data based on our validation rules set in permissionFormSchema
    defaultValues: {
      name: '',
      abbreviation: '',
      description: '',
    },
  }); // declare useForm

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setFileInfo(
        `File: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`
      );
    } else {
      form.setValue('image', undefined);
      setFileInfo(null);
    }
  };

  const handleSubmit: SubmitHandler<{
    name: string;
    abbreviation: string;
    scheduling: 'on_demand' | 'locking';
    permission: 'open' | 'special_permission';
    description?: string | undefined;
    image?: any;
  }> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-bold">Abbreviation</FormLabel>
                  <FormControl>
                    <Input placeholder="Abbreviation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="scheduling"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-bold">Scheduling</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]" {...field}>
                        <SelectValue placeholder="Pick Scheduling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on_demand">On Demand</SelectItem>
                        <SelectItem value="locking">Locking</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-bold">Permission</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]" {...field}>
                        <SelectValue placeholder="Pick Permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="special_permission">
                          Special Permission
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e);
                        field.onChange(e.target.files?.[0]);
                      }}
                      accept=".jpg,.jpeg,.png,.webp"
                    />
                  </FormControl>
                  {fileInfo && (
                    <p className="text-sm text-gray-500">{fileInfo}</p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PermissionsForm;
