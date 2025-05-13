import * as z from 'zod';

export const BambuNodeFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must contain at least 3 character(s)')
    .max(30, 'Name must not be greater than 30 character(s)'),
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
});

export type BambuNodeFormData = z.infer<typeof BambuNodeFormSchema>;
