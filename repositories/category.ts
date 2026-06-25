import { prisma } from '@/lib/prisma';
import { AssetType, Category, Prisma } from '@/lib/generated/prisma/client';
import { UpdateCategorySchemaType } from '@/zod/category';
import { ImageSchemaType } from '@/zod/common';

export async function doesCategoryExists(name: string) {
    const categoryCount = await prisma.category.count({
        where: {
            name: {
                equals: name,
                mode: 'insensitive',
            },
        },
    });

    if (categoryCount > 0) return true;
    return false;
}

export async function createCategory(
    name: string,
    backgroundColor: string,
    subcategories: string[],
    image?: { url: string; fileId: string; type: AssetType }
) {
    const category = await prisma.category.create({
        data: {
            name,
            backgroundColor,
            subCategory: {
                create: subcategories.map((val) => ({ name: val })),
            },
            image: {
                create: image,
            },
        },
    });

    return category;
}

export async function getCategories(page: number = 1, limit: number = 15, search: string = '') {
    const categories = await prisma.category.findMany({
        where: {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        },
        include: {
            subCategory: {
                include: {
                    product: {
                        include: { _count: true },
                    },
                },
            },
            image: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return categories;
}

export async function deleteCategory(name: string) {
    await prisma.category.delete({
        where: {
            name,
        },
    });
}

export async function getCategoryByIdRepo(
    id: Category['id'],
    tx: Prisma.TransactionClient = prisma
) {
    const category = await tx.category.findFirst({
        where: { id },
        include: { subCategory: true, image: true },
    });

    return category;
}

export async function getCategoryByNameRepo(name: Category['name']) {
    const category = await prisma.category.findFirst({
        where: { name },
        include: { subCategory: true },
    });

    return category;
}

export async function updateCategoryRepo(
    id: Category['id'],
    payload: Omit<UpdateCategorySchemaType, 'image'>,
    tx: Prisma.TransactionClient = prisma
) {
    const updatedCategory = await tx.category.update({
        where: { id },
        data: {
            name: payload.name,
            backgroundColor: payload.backgroundColor,
        },
    });

    return updatedCategory;
}

export async function updateCategoryImageRepo(
    id: Category['id'],
    image: ImageSchemaType,
    tx: Prisma.TransactionClient = prisma
) {
    const updatedCategory = await tx.category.update({
        where: { id },
        data: {
            image: {
                upsert: {
                    create: image,
                    update: {
                        ...image,
                    },
                },
            },
        },
    });

    return updatedCategory;
}
