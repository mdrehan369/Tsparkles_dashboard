import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { TopProducts } from '@/components/dashboard/top-products';
import { SalesChart } from '@/components/dashboard/sales-chart';

export default function Dashboard() {
    return (
        <div className='p-8'>
            <MetricsOverview />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8'>
                <div className='lg:col-span-2'>
                    <SalesChart />
                </div>
                <TopProducts />
            </div>
            <div className='mt-8'>
                <RecentOrders />
            </div>
        </div>
    );
}
