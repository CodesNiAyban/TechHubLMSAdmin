import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const resetSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(1, {
    message: "Password is Required",
  }).
    max(32, {
      message: "Password must be less than 32 characters"
    }),
  code: z.optional(
    z.string().min(6, {
      message: "Your two factor code must be 6 characters",
    })
  ),
});

export const registerSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(6, {
    message: "Name is required",
  }),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
