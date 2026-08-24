'use server';

import { Order, OrderStatus, Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const PAGE_SIZE = 10;

function buildOrderWhere(search: string, status?: OrderStatus) {
    const q = search.trim();
    return {
        ...(status && { status }),
        ...(q && {
            OR: [
                { orderNumber: { contains: q, mode: 'insensitive' as const } },
                { email: { contains: q, mode: 'insensitive' as const } },
                { phoneNumber: { contains: q, mode: 'insensitive' as const } },
                { items: { some: { title: { contains: q, mode: 'insensitive' as const } } } },
            ],
        }),
    } satisfies Prisma.OrderWhereInput;
}

export const getOrdersPage = async ({
    page = 1,
    search = '',
    status,
}: {
    page?: number;
    search?: string;
    status?: OrderStatus;
}) => {
    try {
        const where = buildOrderWhere(search, status);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    items: true,
                    payments: true,
                },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.order.count({ where }),
        ]);

        return { orders, total, pageSize: PAGE_SIZE };
    } catch (err) {
        console.log(err);
        return { orders: [], total: 0, pageSize: PAGE_SIZE };
    }
};

export const getOrdersStatusCounts = async ({ search = '' }: { search?: string }) => {
    try {
        const grouped = await prisma.order.groupBy({
            by: ['status'],
            _count: { _all: true },
            where: buildOrderWhere(search),
        });

        const counts = {} as Record<'ALL' | OrderStatus, number>;
        counts.ALL = 0;
        for (const group of grouped) {
            counts[group.status] = group._count._all;
            counts.ALL += group._count._all;
        }

        return counts;
    } catch (err) {
        console.log(err);
        return { ALL: 0 } as Record<'ALL' | OrderStatus, number>;
    }
};

export const getOrderById = async (id: Order['id']) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                payments: true,
            },
        });

        return order;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const updateOrderStatus = async (id: Order['id'], status: OrderStatus) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) return false;

        if (order.status == status) return false;
        if (order.status == OrderStatus.DELIVERED) return false;
        if (order.status == OrderStatus.PENDING && status == OrderStatus.DELIVERED) return false;
        if (order.status == OrderStatus.SHIPPED && status == OrderStatus.PENDING) return false;

        await prisma.order.update({
            where: { id },
            data: { status },
        });

        revalidatePath('/orders');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};
