import { z } from 'zod';

export const AddProductFormSchema = z.object({
    title: z.string({ message: 'Title is required!' }),
    description: z.string({ message: 'Description is required!' }),
    price: z.number({ message: 'Price is required' }).gt(0, { message: 'Invalid Price' }),
    comparePrice: z
        .number({ message: 'Compare price is required' })
        .gt(0, { message: 'Invalid Compare Price' }),
    category: z.number({ message: 'Category is required' }),
    subCategory: z.number({ message: 'Sub Category is required' }),
});
