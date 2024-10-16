'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageCropper } from '@/components/Permissions Page/ImageCropper';
import { FileWithPreview } from '@/interfaces/permissionpage.interfaces';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import { permissionFormSchema, PermissionFormData } from '@/schemas/permissionFormSchema';

const PermissionsForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      description: '',
      scheduling: 'on_demand',
      permission: 'default',
    },
  });

  const queryClient = useQueryClient();
  const addNewPermissionMutation = useMutation(
    (data: PermissionFormData) => submitPermissionForm(data),
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries('permissions');
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    }
  );

  const submitPermissionForm = async (data: PermissionFormData) => {
    try {
      // change data.image to be the cropped image instead of the original image
      if (croppedImage) {
        data.image = croppedImage;
      }
      console.log(data);
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      console.log('Form submitted sucessfully');
      form.reset();
      setCroppedImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  const handleSubmit: SubmitHandler<PermissionFormData> = (data) => {
    addNewPermissionMutation.mutate(data); // Call the mutation
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="mb-[-5px] grid grid-cols-2 grid-rows-1 gap-12">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-dark100_light900">Name</FormLabel>
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
            name="abbreviation"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-dark100_light900">Abbreviation</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark100_light900">Description</FormLabel>
              <FormControl>
                <Textarea
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
          name="scheduling"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark100_light900">Scheduling</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="background-light900_dark300 text-dark100_light900">
                    <SelectValue placeholder="Select scheduling" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="background-light900_dark300 text-dark100_light900">
                  <SelectItem value="on_demand">On Demand</SelectItem>
                  <SelectItem value="locking">Locking</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark100_light900">Permission</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="background-light900_dark300 text-dark100_light900">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="background-light900_dark300 text-dark100_light900">
                  <SelectItem value="default">Default </SelectItem>
                  <SelectItem value="special">Special </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark100_light900">Image</FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="background-light900_dark300 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors duration-200 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <input
                    {...getInputProps()}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      onDrop(Array.from(e.target.files || []));
                    }}
                  />
                  <div className="text-center">
                    <svg
                      className="mx-auto size-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Drag & drop an image here, or click to select one
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {selectedFile && (
          <ImageCropper
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setCroppedImage={setCroppedImage}
          />
        )}

        {croppedImage && (
          <div className="relative mt-4 inline-block">
            <div className="overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
              <Image
                src={croppedImage}
                alt="Cropped"
                width={144}
                height={144}
                className="cursor-pointer object-cover"
                onClick={() => setDialogOpen(true)}
              />
            </div>
            <div className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600">
              <X
                size={14}
                onClick={() => {
                  setSelectedFile(null);
                  setCroppedImage(null);
                  form.setValue('image', null);
                }}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className={`w-full text-lg text-white transition-colors ${
            isSubmitting
              ? 'bg-orange-500 hover:bg-orange-500'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PermissionsForm;
