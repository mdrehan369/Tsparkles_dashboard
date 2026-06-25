import { prisma } from '@/lib/prisma';
import { Asset, Category, Prisma, Product } from '@/lib/generated/prisma/client';
import { AddProductParams } from '@/types/product.types';

async function createProduct({
    categoryId,
    details,
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
            details,
            assets: {
                createMany: {
                    data: files,
                },
            },
            updatedAt: new Date(),
        },
        include: {
            assets: true,
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
            assets: true,
            category: true,
            subCategory: true,
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
            assets: true,
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

async function updateProductRepo(id: Product['id'], updateData: AddProductParams) {
    const { title, categoryId, price, details, comparePrice, subCategoryId, files } = updateData;
    const updatedProduct = await prisma.product.update({
        where: {
            id,
        },
        data: {
            title,
            details,
            price,
            comparePrice,
            category: {
                connect: { id: categoryId },
            },
            subCategory: {
                connect: { id: subCategoryId },
            },
            assets: {
                createMany: { data: files, skipDuplicates: true },
            },
        },
        include: {
            assets: true,
            category: true,
            subCategory: true,
        },
    });

    return updatedProduct;
}

async function deleteAssetFromProductRepo(id: Product['id'], fileId: Asset['fileId']) {
    return await prisma.product.update({
        where: { id },
        include: { assets: true },
        data: {
            assets: {
                deleteMany: {
                    fileId,
                },
            },
        },
    });
}

async function getProductsByCategoryRepo(categoryId: Category['id']) {
    return await prisma.product.count({
        where: {
            categoryId,
        },
    });
}

async function updateProductPublicationStatusRepo(productId: Product['id'], status: boolean) {
    return await prisma.product.update({
        where: { id: productId },
        data: {
            isPublished: status,
        },
    });
}

export {
    createProduct,
    getProducts,
    getProductById,
    deleteProductById,
    updateProductRepo,
    deleteAssetFromProductRepo,
    getProductsByCategoryRepo,
    updateProductPublicationStatusRepo,
};
