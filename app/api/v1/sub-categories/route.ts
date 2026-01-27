import { getCategoryByIdRepo } from '@/repositories/category';
import { createSubCategoryRepo } from '@/repositories/subcategories';
import zodValidator from '@/utils/zodValidator';
import { createSubCategorySchema } from '@/zod/sub-category';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, categoryId } = zodValidator(createSubCategorySchema, body);

    const category = await getCategoryByIdRepo(categoryId);
    if (!category)
        return NextResponse.json({ success: false, message: 'No Category found' }, { status: 404 });

    const subcatExists = category.SubCategory.find(
        (sub) => sub.name.toLowerCase() == name.toLowerCase()
    );
    if (subcatExists)
        return NextResponse.json(
            { success: false, message: 'Sub category with this name already exists' },
            { status: 400 }
        );

    const newSubCategory = await createSubCategoryRepo(categoryId, name);
    return NextResponse.json(
        { success: true, message: 'Created!', data: newSubCategory },
        { status: 201 }
    );
}
