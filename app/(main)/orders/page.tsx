import { getAllOrders } from '@/actions/orders';
import { OrdersTable } from '@/components/orders/OrderTable';

export default async function OrdersPage() {
    const orders = (await getAllOrders()) as any;
    return <OrdersTable orders={orders} />;
}
