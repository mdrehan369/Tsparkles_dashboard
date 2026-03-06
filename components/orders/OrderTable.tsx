'use client';

import OrderActions from '@/components/orders/orderActions';
import OrderBadge from '@/components/orders/orderBadge';
import PaymentBadge from '@/components/orders/paymentBadge';
import { OrderStatus, PaymentStatus } from '@/lib/generated/prisma/client';

type OrderRow = {
    id: number;
    orderNumber: string;
    email: string;
    phoneNumber?: string | null;
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    items: { id: number }[];
};

interface OrdersTableProps {
    orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    return (
        <div className='bg-white rounded-2xl shadow-sm border overflow-hidden'>
            <table className='w-full text-sm'>
                <thead className='bg-gray-50 text-gray-600 uppercase text-xs'>
                    <tr>
                        <th className='px-6 py-4 text-left'>Order</th>
                        <th className='px-6 py-4 text-left'>Customer</th>
                        <th className='px-6 py-4 text-left'>Items</th>
                        <th className='px-6 py-4 text-left'>Total</th>
                        <th className='px-6 py-4 text-left'>Payment</th>
                        <th className='px-6 py-4 text-left'>Status</th>
                        <th className='px-6 py-4 text-left'>Date</th>
                        <th className='px-6 py-4 text-right'></th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className='border-t hover:bg-gray-50 transition'>
                            <td className='px-6 py-4 font-medium'>#{order.orderNumber}</td>

                            <td className='px-6 py-4'>
                                <div>{order.email}</div>
                                {order.phoneNumber && (
                                    <div className='text-xs text-gray-500'>{order.phoneNumber}</div>
                                )}
                            </td>

                            <td className='px-6 py-4'>{order.items.length}</td>

                            <td className='px-6 py-4 font-semibold'>
                                ₹{order.totalAmount.toFixed(2)}
                            </td>

                            <td className='px-6 py-4'>
                                <PaymentBadge status={order.paymentStatus} />
                            </td>

                            <td className='px-6 py-4'>
                                <OrderBadge status={order.status} />
                            </td>

                            <td className='px-6 py-4 text-gray-500'>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>

                            <td className='px-6 py-4 text-right'>
                                <OrderActions orderId={order.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
