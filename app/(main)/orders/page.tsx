import { OrdersTable } from '@/components/orders/OrderTable';

export default function OrdersPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-light tracking-tight text-foreground'>Orders</h1>
                <p className='text-sm text-muted-foreground mt-2'>
                    Track and manage customer orders
                </p>
            </div>

            <OrdersTable />
        </div>
    );
}
