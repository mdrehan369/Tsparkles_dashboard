import { Prisma } from '@/lib/generated/prisma/client';

export type CustomerWithOrders = Prisma.AccountGetPayload<{
    include: {
        orders: {
            select: {
                id: true;
                totalAmount: true;
                status: true;
                createdAt: true;
            };
        };
        _count: {
            select: {
                orders: true;
                addresses: true;
            };
        };
    };
}>;

export type CustomerMetrics = {
    totalCustomers: number;
    verifiedCustomers: number;
    totalRevenue: number;
    totalOrders: number;
};
