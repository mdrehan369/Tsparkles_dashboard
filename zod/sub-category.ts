import z from 'zod';

export const createSubCategorySchema = z.object({
    categoryId: z.number({ message: 'Category ID is required' }),
    name: z.string().min(1, 'Name is required'),
});
