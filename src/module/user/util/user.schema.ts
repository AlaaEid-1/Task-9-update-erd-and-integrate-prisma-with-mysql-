import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  password: z.string().min(6).optional(),
});

export const createCoachSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
