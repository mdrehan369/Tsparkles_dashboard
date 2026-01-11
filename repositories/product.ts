import { prisma } from '@/lib/prisma';
import { Prisma, Product } from '@/prisma/generated/prisma/client';
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

async function getProducts({
    page = 1,
    limit = 15,
    search = '',
}: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    const query: Prisma.ProductWhereInput = {};

    if (search && search != '')
        query['title'] = {
            startsWith: search,
            mode: 'insensitive',
        };

    const products = await prisma.product.findMany({
        where: query,
        include: {
            Asset: true,
            Category: true,
            SubCategory: true,
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return products;
}

async function getProductById(id: Product['id']) {
    return await prisma.product.findFirst({
        where: {
            id,
        },
        include: {
            Asset: true,
        },
    });
}

async function deleteProductById(id: Product['id']) {
    const deletedProduct = await prisma.product.delete({
        where: {
            id,
        },
    });

    return deletedProduct;
}

export { createProduct, getProducts, getProductById, deleteProductById };
