'use client';

import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ImageCropper } from '@/components/Permissions Page/ImageCropper';
import { useDropzone } from 'react-dropzone';
import { Types } from 'mongoose';
import { FileWithPreview } from '@/interfaces/permissionpage.interfaces';
import { PermissionFormData, permissionFormSchema } from '@/schemas/permissionFormSchema';
import { updatePermission } from '@/hooks/permissionHooks';
import { IPerm } from '@/interfaces/database.interfaces';
import { Textarea } from '../ui/textarea';

// updating permission API route

const EditPermissionDialog = ({
  permId,
  initialData,
}: {
  permId: Types.ObjectId;
  initialData: IPerm;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialData.image.toString()
  );

  const queryClient = useQueryClient();

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: initialData.name,
      abbreviation: initialData.abbreviation,
      description: initialData.description,
      scheduling:
        initialData.scheduling === 'scheduled' ? 'on_demand' : initialData.scheduling,
      permission: initialData.default ? 'default' : 'special',
      image: initialData.image,
    },
  });

  // Update local state when data prop changes

  useEffect(() => {
    if (open) {
      // Only update when dialog is open
      setCurrentImage(initialData.image.toString());
      form.reset({
        name: initialData.name,
        abbreviation: initialData.abbreviation,
        description: initialData.description,
        scheduling:
          initialData.scheduling === 'scheduled' ? 'on_demand' : initialData.scheduling,
        permission: initialData.default ? 'default' : 'special',
        image: initialData.image,
      });
    }
  }, [initialData, open, form]); // Add initialData and open to dependencies

  const handleDialogChange = (newOpen: boolean) => {
    setOpen(newOpen);

    // If dialog is being closed, reset states after animation
    if (!newOpen) {
      // Wait for dialog close animation (300ms is standard for shadcn/ui before resseting form)
      setTimeout(() => {
        setCroppedImage(null);
        setSelectedFile(null);
        setCurrentImage(initialData.image.toString());
        form.reset({
          name: initialData.name,
          abbreviation: initialData.abbreviation,
          description: initialData.description,
          scheduling:
            initialData.scheduling === 'scheduled' ? 'on_demand' : initialData.scheduling,
          permission: initialData.default ? 'default' : 'special',
          image: initialData.image,
        });
      }, 300);
    }
  };

  // SETTING FORM VALUE FOR IMAGE
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    }
  };

  // DROPZONE HOOKS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  // UPDATE MUTATION (EXECUTES WHEN FORM IS SUBMITTED)
  const updatePermMutation = useMutation(
    async (formData: PermissionFormData) => {
      console.log('formData', formData);
      return updatePermission(permId, {
        scheduling: formData.scheduling,
        name: formData.name,
        abbreviation: formData.abbreviation,
        description: formData.description,
        default: formData.permission === 'default',
        image: new Types.ObjectId(
          croppedImage || currentImage || new Types.ObjectId().toString()
        ),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('permissions');
        setOpen(false);
        form.reset();
        setCroppedImage(null);
        setSelectedFile(null);
      },
    }
  );

  // HANDLING SUBMIT

  const handleSubmit: SubmitHandler<PermissionFormData> = (data) => {
    updatePermMutation.mutate(data);
  };

  const handleImageRemove = () => {
    setSelectedFile(null);
    setCroppedImage(null);
    setCurrentImage(null);
    form.setValue('image', null);
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
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          handleDialogChange(false);
        }}
        onInteractOutside={(event) => {
          event.preventDefault();
          handleDialogChange(false);
        }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-semibold">Edit Permission</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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

            {/* Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-dark100_light900">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="background-light900_dark300 text-dark100_light900 min-h-[100px]"
                      placeholder="Enter description..."
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Use value instead of defaultValue
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="background-light900_dark300 text-dark100_light900">
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="background-light900_dark300 text-dark100_light900">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* IMAGE UPLOAD */}
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

            {/* IMAGE CROPPER */}
            {selectedFile && (
              <ImageCropper
                dialogOpen={isDialogOpen}
                setDialogOpen={setDialogOpen}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setCroppedImage={setCroppedImage}
              />
            )}

            {/* IMAGE PREVIEW */}
            {(croppedImage || currentImage) && (
              <div className="relative mt-4 inline-block">
                <div className="overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
                  <Image
                    src={croppedImage || currentImage || ''}
                    alt="Permission"
                    width={144}
                    height={144}
                    className="cursor-pointer object-cover"
                    onClick={() => selectedFile && setDialogOpen(true)}
                  />
                </div>
                <button
                  type="button"
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                  onClick={handleImageRemove}
                >
                  <X size={14} />
                </button>
              </div>
            )}

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

export default EditPermissionDialog;
