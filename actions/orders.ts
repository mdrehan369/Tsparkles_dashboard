import { prisma } from '@/lib/prisma';

export const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            items: true,
        },
    });

    return orders;
};
