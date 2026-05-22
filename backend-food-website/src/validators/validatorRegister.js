import { z } from "zod";

const registerValidator = z.object({
  name: z.string(),
  email: z.string().email().min(6).max(60),
  password: z.string().min(6).max(60),
  role: z.string().optional(),
});

const loginValidator = z.object({
  email: z.string().email().min(6).max(60),
  password: z.string().min(6).max(60),
});

const updateValidator = z.object({
  name: z.string().optional(),
  email: z.string().email().min(6).max(60).optional(),
  password: z.string().min(6).max(60).optional(),
});

export { registerValidator, loginValidator, updateValidator };
