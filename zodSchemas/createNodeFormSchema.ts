import { IPerm } from '@/interfaces/database.interfaces';

import * as z from 'zod';

export const createNodeFormSchema = (permissions: IPerm[]) => {
  const permissionTypes = permissions.map((perm) => perm.abbreviation);

  const baseSchema = z.object({
    name: z
      .string()
      .min(3, 'Name must contain at least 3 character(s)')
      .max(30, 'Name must not be greater than 30 character(s)'),
    type: z.enum(permissionTypes as [string, ...string[]]),
  });

  // Schema for BAM (Bambu printer)
  const bambuPrinterSchema = z.object({
    type: z.literal('BAM'),
    IP: z
      .string()
      .regex(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        'Must be a valid IPv4 address (e.g., 192.168.104.0)'
      ),
    SerialNumber: z
      .string()
      .regex(
        /^[0-9A-Z]{15}$/,
        'Must be a valid Bambu Lab printer serial number (15 alphanumeric characters)'
      ),
    accessCode: z.string().regex(/^\d{8}$/, 'Access code must be exactly 8 digits'),
    owner: z.string(),
  });

  // Schema for BCP (control panel)
  const controlPanelSchema = z.object({
    type: z.literal('BCP'),
    raspBerry: z.string(),
  });

  // Combine schemas based on type
  return z.discriminatedUnion('type', [
    bambuPrinterSchema.merge(baseSchema.omit({ type: true })),
    controlPanelSchema.merge(baseSchema.omit({ type: true })),
  ]);

  // If you'd like to add a new type of schema for a new type of device, simply make a const schema
  // add it as part of the discrimination union schema
};

export type createNodeFormData = z.infer<ReturnType<typeof createNodeFormSchema>>;
