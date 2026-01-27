import { prisma } from '@/lib/prisma';
import { Category } from '@/prisma/generated/prisma/client';

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

export async function createCategory(name: string, subcategories: string[]) {
    const category = await prisma.category.create({
        data: {
            name,
            SubCategory: {
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
            SubCategory: {
                include: {
                    Product: {
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

export async function getCategoryByIdRepo(id: Category['id']) {
    const category = await prisma.category.findFirst({
        where: { id },
        include: { SubCategory: true },
    });

    return category;
}

export async function getCategoryByNameRepo(name: Category['name']) {
    const category = await prisma.category.findFirst({
        where: { name },
        include: { SubCategory: true },
    });

    return category;
}
