import { STATUS_CODES } from '@/constants/status_codes';
import {
    doesCategoryExists,
    getCategoryByIdRepo,
    updateCategoryRepo,
} from '@/repositories/category';
import asyncHandler from '@/utils/asyncHandler';
import txHandler from '@/utils/txHandler';
import { UpdateCategorySchema } from '@/zod/category';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = asyncHandler(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        return await txHandler(async (tx) => {
            const body = await request.json();
            const parsedBody = UpdateCategorySchema.parse(body);

            const { id } = await params;
            const categoryId = Number(id);
            const { name } = parsedBody;

            const category = await getCategoryByIdRepo(categoryId, tx);
            if (!category)
                return NextResponse.json(
                    { success: false, message: 'No category found!', data: null },
                    { status: STATUS_CODES.NOT_FOUND }
                );

            if (name) {
                const nameTaken = await doesCategoryExists(name, categoryId);
                if (nameTaken)
                    return NextResponse.json(
                        {
                            success: false,
                            data: null,
                            message: 'Category with this name already exists',
                        },
                        { status: STATUS_CODES.BAD_REQUEST }
                    );
            }

            await updateCategoryRepo(categoryId, { name }, tx);

            const updatedCategory = await getCategoryByIdRepo(categoryId, tx);

            return NextResponse.json({
                success: true,
                message: 'Category updated successfully!',
                data: updatedCategory,
            });
        });
    }
);
