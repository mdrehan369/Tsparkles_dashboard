import { OrderStatus } from '@/lib/generated/prisma/enums';

function OrderBadge({ status }: { status: OrderStatus }) {
    const styles: Record<OrderStatus, string> = {
        PENDING: 'bg-gray-100 text-gray-700',
        CONFIRMED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-indigo-100 text-indigo-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
        RETURNED: 'bg-orange-100 text-orange-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
}

export default OrderBadge;
