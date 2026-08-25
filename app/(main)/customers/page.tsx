import { CustomerMetrics } from '@/components/customers/CustomerMetrics';
import { CustomerTable } from '@/components/customers/CustomerTable';

export default function CustomersPage() {
    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-light tracking-tight text-foreground'>Customers</h1>
                <p className='text-sm text-muted-foreground mt-2'>
                    View and manage your customer base
                </p>
            </div>

            <CustomerMetrics />
            <CustomerTable />
        </div>
    );
}
