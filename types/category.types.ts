import { Prisma } from '@/lib/generated/prisma/client';

export type CategoryWithSubCategory = Prisma.CategoryGetPayload<{
    include: {
        subCategory: {
            include: {
                product: {
                    include: {
                        _count: true;
                    };
                };
            };
        };
        image: true;
    };
}>;
