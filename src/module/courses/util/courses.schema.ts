import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});
