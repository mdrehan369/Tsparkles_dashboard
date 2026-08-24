import { Prisma } from '@/lib/generated/prisma/client';

export type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        items: true;
        payments: true;
    };
}>;
