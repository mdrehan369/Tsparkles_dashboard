import { z } from 'zod';

export const CreateCategorySchema = z.object({
    name: z.string({ message: 'Category name is required!' }).min(1, 'Category is required'),
    subcategories: z.array(z.string({ message: 'Sub-Category name is required!' })).optional(),
});
