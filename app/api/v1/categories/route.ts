import {
    createCategory,
    deleteCategory,
    doesCategoryExists,
    getCategories,
    getCategoryByNameRepo,
} from '@/repositories/category';
import { getProductsByCategoryRepo } from '@/repositories/product';
import { deleteSubcategorysById, doesSubcategoriesExists } from '@/repositories/subcategories';
import asyncHandler from '@/utils/asyncHandler';
import { CreateCategorySchema } from '@/zod/category';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = asyncHandler(
    async (request: NextRequest, _context: { params: Promise<Record<string, never>> }) => {
        const body = await request.json();

        const parsedBody = CreateCategorySchema.parse(body);
        const { name, subcategories } = parsedBody;

        const categoryCnt = await doesCategoryExists(name);
        if (categoryCnt)
            return NextResponse.json(
                { success: false, message: 'Category already exists with this name' },
                { status: 400 }
            );

        const subcategoryCnt = await doesSubcategoriesExists(subcategories || []);
        if (subcategoryCnt)
            return NextResponse.json(
                { success: false, message: 'Category already exists with this name' },
                { status: 400 }
            );

        const newCategory = await createCategory(name, subcategories || []);

        return NextResponse.json(newCategory, { status: 201 });
    }
);

export const GET = asyncHandler(
    async (request: NextRequest, _context: { params: Promise<Record<string, never>> }) => {
        const page = Number(request.nextUrl.searchParams.get('page') || 1);
        const limit = Number(request.nextUrl.searchParams.get('limit') || 15);
        const search = request.nextUrl.searchParams.get('search') || '';

        const categories = await getCategories(page, limit, search);

        return NextResponse.json({ success: true, message: 'Fetched!', data: categories });
    }
);

export const DELETE = asyncHandler(
    async (request: NextRequest, _context: { params: Promise<Record<string, never>> }) => {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ success: false, message: 'No name given' });

        const category = await getCategoryByNameRepo(name);
        if (!category)
            return NextResponse.json(
                { success: false, message: 'No category found to delete' },
                { status: 400 }
            );

        const productCnt = await getProductsByCategoryRepo(category.id);
        if (productCnt)
            return NextResponse.json(
                {
                    success: false,
                    message: `${productCnt} product(s) already exists with this category. Delete them first`,
                },
                { status: 400 }
            );

        await deleteCategory(name);
        await deleteSubcategorysById(category.subCategory.map((sub) => sub.id));

        return NextResponse.json({ success: true, message: 'Deleted successfully!' }, { status: 200 });
    }
);
