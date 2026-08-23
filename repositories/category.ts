import { prisma } from '@/lib/prisma';
import { Category, Prisma } from '@/lib/generated/prisma/client';
import { UpdateCategorySchemaType } from '@/zod/category';

export async function doesCategoryExists(name: string, excludeId?: Category['id']) {
    const categoryCount = await prisma.category.count({
        where: {
            name: {
                equals: name,
                mode: 'insensitive',
            },
            ...(excludeId !== undefined && { id: { not: excludeId } }),
        },
    });

    if (categoryCount > 0) return true;
    return false;
}

export async function createCategory(name: string, subcategories: string[]) {
    const category = await prisma.category.create({
        data: {
            name,
            subCategory: {
                create: subcategories.map((val) => ({ name: val })),
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
        include: { subCategory: true },
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
        },
    });

    return updatedCategory;
}
