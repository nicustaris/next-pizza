import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(4, { message: "Incorrect password" });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Incorrect email address" }),
  password: passwordSchema,
});

export const registerFormSchema = loginFormSchema
  .merge(
    z.object({
      fullName: z.string().min(4, { message: "Incorrect name" }),
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords entered do not match",
    path: ["confirmPassword"],
  });

export type TLoginFormValues = z.infer<typeof loginFormSchema>;
export type TRegisterFormValues = z.infer<typeof registerFormSchema>;
