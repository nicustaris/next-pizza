import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "The first name should have at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "The last name should have at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(9, { message: "Incorrect phone number" }),
  address: z.string().min(3, { message: "Incorrect delivery address" }),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
