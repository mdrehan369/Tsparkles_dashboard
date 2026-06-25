import { z } from 'zod';
import { ImageSchema } from './common';

export const CreateCategorySchema = z.object({
    name: z.string({ message: 'Category name is required!' }).min(1, 'Category is required'),
    backgroundColor: z.string({ message: 'Background color is required!' }),
    subcategories: z.array(z.string({ message: 'Sub-Category name is required!' })).optional(),
    image: ImageSchema.nullable(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;
