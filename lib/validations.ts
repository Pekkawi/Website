import { z } from "zod";

export const permissionSchema = z.object({
  machineName: z
    .string()
    .min(2, {
      message: "Machine name must be at least 2 characters.",
    })
    .max(50, { message: "Machine name must be at most 50 characters." }),
  abbreviation: z
    .string()
    .length(3, { message: "Abbreviation must be 3 characters." })
    .refine((val) => /^[A-Z]+$/.test(val), {
      message: "Abbreviation must be all uppercase letters.",
    }),
  description: z
    .string()
    .min(0)
    .max(300, { message: "Description must be at most 300 characters." }),
});
