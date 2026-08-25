'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma/client';

const PAGE_SIZE = 5;

function buildCustomerWhere(search: string, verified?: boolean) {
    const q = search.trim();
    return {
        ...(verified !== undefined && { isVerified: verified }),
        ...(q && {
            OR: [
                { name: { contains: q, mode: 'insensitive' as const } },
                { email: { contains: q, mode: 'insensitive' as const } },
                { phoneNumber: { contains: q, mode: 'insensitive' as const } },
            ],
        }),
    } satisfies Prisma.AccountWhereInput;
}

export const getCustomersPage = async ({
    page = 1,
    search = '',
    verified,
}: {
    page?: number;
    search?: string;
    verified?: boolean;
}) => {
    try {
        const where = buildCustomerWhere(search, verified);

        const [accounts, total] = await Promise.all([
            prisma.account.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    orders: {
                        select: {
                            id: true,
                            totalAmount: true,
                            status: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                    _count: {
                        select: {
                            orders: true,
                            addresses: true,
                        },
                    },
                },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.account.count({ where }),
        ]);

        return { accounts, total, pageSize: PAGE_SIZE };
    } catch (err) {
        console.log(err);
        return { accounts: [], total: 0, pageSize: PAGE_SIZE };
    }
};

export const getCustomerMetrics = async () => {
    try {
        const [totalCustomers, verifiedCustomers, revenueAgg, orderCount] = await Promise.all([
            prisma.account.count(),
            prisma.account.count({ where: { isVerified: true } }),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
            }),
            prisma.order.count(),
        ]);

        return {
            totalCustomers,
            verifiedCustomers,
            totalRevenue: revenueAgg._sum.totalAmount ?? 0,
            totalOrders: orderCount,
        };
    } catch (err) {
        console.log(err);
        return {
            totalCustomers: 0,
            verifiedCustomers: 0,
            totalRevenue: 0,
            totalOrders: 0,
        };
    }
};
