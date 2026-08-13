import { ProductSizeUnit } from '@/lib/generated/prisma/enums';
import { z } from 'zod';

export const AddProductFormSchema = z.object({
    title: z.string({ message: 'Title is required!' }),
    description: z.string({ message: 'Description is required!' }),
    category: z.number({ message: 'Category is required' }).min(1, 'No category provided!'),
    subCategory: z
        .number({ message: 'Sub Category is required' })
        .min(1, 'No sub category provided'),
    colors: z
        .array(
            z.object({
                color: z.string({ message: 'Color is required!' }).min(7, 'Invalid color code!'),
                label: z
                    .string({ message: 'Label of color is required!' })
                    .min(1, 'Label is required!'),
            })
        )
        .min(1, 'No colors added!'),
    variants: z
        .array(
            z
                .object({
                    size: z.number().gt(0, 'Invalid product size'),
                    stock: z.number().int().gte(0),
                    unit: z.nativeEnum(ProductSizeUnit).default(ProductSizeUnit.INCH),
                    price: z.number().int().gt(0, 'Price should be greator than 0'),
                    weight: z.number().int().gt(0, 'Weight should be greator than 0'),
                    comparePrice: z
                        .number()
                        .positive()
                        .int()
                        .gt(0, 'Compare price should be greator than 0'),
                })
                .refine(
                    (payload) => payload.price < payload.comparePrice,
                    'Compare price cannot be lower than price!'
                )
        )
        .min(1, 'No variants added!'),
});

export const GetProductsQueryStringSchema = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(15),
    search: z.string().optional().default(''),
});

export type AddProductFormType = z.infer<typeof AddProductFormSchema>;
export type EditProductFormDataType = z.infer<typeof AddProductFormSchema>;
