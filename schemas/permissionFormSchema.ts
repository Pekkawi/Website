import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const permissionFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must contain at least 3 character(s)')
    .max(30, 'Name must not be greater than 30 character(s)'),
  abbreviation: z
    .string()
    .length(3, 'Abbreviation must be 3 character(s)')
    .refine(
      (value) => value === value.toUpperCase(),
      'Abbreviation must be 3 uppercase letters'
    ),
  description: z
    .string()
    .max(300, 'Description must not be greater than 300 character(s)')
    .optional(),
  scheduling: z.enum(['on_demand', 'locking']),
  permission: z.enum(['default', 'special']),
  image: z
    .any()
    .refine((files) => files, "Image can't be empty")
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      'Max image size is 5MB'
    )
    .refine(
      (files) =>
        !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
});

export type PermissionFormData = z.infer<typeof permissionFormSchema>;
