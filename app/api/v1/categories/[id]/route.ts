import { STATUS_CODES } from '@/constants/status_codes';
import { Category } from '@/lib/generated/prisma/client';
import {
    doesCategoryExists,
    getCategoryByIdRepo,
    updateCategoryImageRepo,
    updateCategoryRepo,
} from '@/repositories/category';
import asyncHandler from '@/utils/asyncHandler';
import txHandler from '@/utils/txHandler';
import { UpdateCategorySchema } from '@/zod/category';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = asyncHandler(
    async (request: NextRequest, { params }: { params: Promise<{ id: Category['id'] }> }) => {
        return await txHandler(async (tx) => {
            const body = await request.json();
            const parsedBody = UpdateCategorySchema.parse(body);

            const { id } = await params;
            const { name, image, backgroundColor } = parsedBody;

            const category = await getCategoryByIdRepo(id, tx);
            if (!category)
                return NextResponse.json(
                    { success: false, message: 'No category found!', data: null },
                    { status: STATUS_CODES.NOT_FOUND }
                );

            if (name) {
                const categoryWithName = await doesCategoryExists(name);
                if (categoryWithName)
                    return NextResponse.json(
                        {
                            success: false,
                            data: null,
                            message: 'Category with this name already exists',
                        },
                        { status: STATUS_CODES.BAD_REQUEST }
                    );
            }

            await updateCategoryRepo(id, { name, backgroundColor }, tx);

            if (image) await updateCategoryImageRepo(id, image, tx);

            const updatedCategory = await getCategoryByIdRepo(id, tx);

            return NextResponse.json({
                success: true,
                message: 'Category updated successfully!',
                data: updatedCategory,
            });
        });
    }
);
