import { Prisma } from '@/prisma/generated/prisma/client';

export type CategoryWithSubCategory = Prisma.CategoryGetPayload<{
    include: {
        SubCategory: {
            include: {
                Product: {
                    include: {
                        _count: true;
                    };
                };
            };
        };
    };
}>;
