import { prisma } from '@/lib/prisma';
import { Category, SubCategory } from '@/lib/generated/prisma/client';

export async function doesSubcategoriesExists(subcategories: string[]) {
    const subcategoryCount = await prisma.subCategory.count({
        where: {
            name: {
                in: subcategories,
            },
        },
    });

    if (subcategoryCount > 0) return true;
    return false;
}

export async function deleteSubcategorysById(subcategoryIds: SubCategory['id'][]) {
    await prisma.subCategory.deleteMany({
        where: {
            id: {
                in: subcategoryIds,
            },
        },
    });
}

export async function createSubCategoryRepo(categoryId: Category['id'], name: string) {
    const subCategory = await prisma.subCategory.create({
        data: {
            name,
            categoryId,
        },
    });

    return subCategory;
}
