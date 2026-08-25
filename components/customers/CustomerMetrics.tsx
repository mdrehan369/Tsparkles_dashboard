'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShieldCheck, ShoppingCart, Users } from 'lucide-react';
import { getCustomerMetrics } from '@/actions/customers';
import { customerKeys } from '@/constants/querykeys';
import { formatCurrency } from '@/utils/helpers';

const metricConfig = [
    {
        title: 'Total Customers',
        key: 'totalCustomers' as const,
        icon: Users,
        format: (v: number) => v.toLocaleString(),
    },
    {
        title: 'Verified Accounts',
        key: 'verifiedCustomers' as const,
        icon: ShieldCheck,
        format: (v: number) => v.toLocaleString(),
    },
    {
        title: 'Total Revenue',
        key: 'totalRevenue' as const,
        icon: DollarSign,
        format: (v: number) => formatCurrency(v),
    },
    {
        title: 'Total Orders',
        key: 'totalOrders' as const,
        icon: ShoppingCart,
        format: (v: number) => v.toLocaleString(),
    },
];

export function CustomerMetrics() {
    const { data } = useQuery({
        queryKey: customerKeys.METRICS,
        queryFn: getCustomerMetrics,
    });

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {metricConfig.map((metric) => (
                <Card key={metric.key} className='border-sidebar-border'>
                    <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                            <CardTitle className='text-sm font-light text-muted-foreground'>
                                {metric.title}
                            </CardTitle>
                            <metric.icon size={16} className='text-muted-foreground' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-light text-foreground'>
                            {data ? metric.format(data[metric.key]) : '—'}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
