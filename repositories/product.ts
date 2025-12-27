import { prisma } from '@/lib/prisma';
import { AddProductParams } from '@/types/product.types';

async function createProduct({
    categoryId,
    description,
    comparePrice,
    title,
    price,
    subCategoryId,
    files,
    slug,
}: AddProductParams & { slug: string }) {
    const newProduct = await prisma.product.create({
        data: {
            title,
            slug,
            price,
            categoryId,
            subCategoryId,
            comparePrice,
            description,
            Asset: {
                createMany: {
                    data: files,
                },
            },
        },
        include: {
            Asset: true,
        },
    });

    return newProduct;
}

export { createProduct };
