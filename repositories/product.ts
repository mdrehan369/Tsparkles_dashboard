import { prisma } from '@/lib/prisma';
import { Asset, Category, Prisma, Product } from '@/lib/generated/prisma/client';
import { AddProductParams } from '@/types/product.types';

// TODO: Remove the updated at thing on next prisma migration
async function createProduct({
    categoryId,
    details,
    title,
    subCategoryId,
    files,
    slug,
    colors,
    variants,
}: AddProductParams & { slug: string }) {
    const newProduct = await prisma.product.create({
        data: {
            title,
            slug,
            categoryId,
            subCategoryId,
            details,
            minPrice: variants.reduce((acc, curr) => Math.min(acc, curr.price), 1000000000),
            ProductColor: {
                createMany: {
                    data: colors.map((c) => ({ ...c, updatedAt: new Date() })),
                },
            },
            assets: {
                createMany: {
                    data: files,
                },
            },
            ProductVariant: {
                createMany: {
                    data: variants.map((v) => ({ ...v, updatedAt: new Date() })),
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

    const [products, count] = await Promise.all([
        prisma.product.findMany({
            where: query,
            include: {
                assets: true,
                category: true,
                subCategory: true,
                ProductVariant: true,
                ProductColor: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),

        prisma.product.count({
            where: query,
        }),
    ]);

    return { products, count };
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
    const { title, categoryId, details, subCategoryId, files, variants, colors } = updateData;
    const updatedProduct = await prisma.product.update({
        where: {
            id,
        },
        data: {
            title,
            details,
            category: {
                connect: { id: categoryId },
            },
            subCategory: {
                connect: { id: subCategoryId },
            },
            assets: {
                createMany: { data: files, skipDuplicates: true },
            },
            ProductVariant: {
                deleteMany: {},
                createMany: {
                    data: variants.map((v) => ({ ...v, updatedAt: new Date() })),
                },
            },
            ProductColor: {
                deleteMany: {},
                createMany: {
                    data: colors.map((c) => ({ ...c, updatedAt: new Date() })),
                },
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
