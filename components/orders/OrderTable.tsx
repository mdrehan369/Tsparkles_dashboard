'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, LoaderCircle, PackageOpen, Search, SearchX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import OrderActions from '@/components/orders/orderActions';
import OrderBadge from '@/components/orders/orderBadge';
import PaymentBadge from '@/components/orders/paymentBadge';
import { PaymentStatus } from '@/lib/generated/prisma/client';
import { formatCurrency } from '@/utils/helpers';
import type { OrderWithRelations } from '@/types/order.types';
import useOrdersTable, { FILTERS, StatusFilter } from '@/hooks/use-orders-table';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';

function latestPaymentStatus(order: OrderWithRelations): PaymentStatus {
    const sorted = [...order.payments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0]?.paymentStatus ?? 'PENDING';
}

export function OrdersTable() {
    const router = useRouter();

    const {
        isFetching,
        isPending,
        orders,
        counts,
        filter,
        setQuery,
        trimmedQuery,
        setPage,
        setFilter,
        query,
        page,
        pageSize,
    } = useOrdersTable();
    return (
        <Card className='border-sidebar-border gap-0'>
            <CardHeader className='border-b border-sidebar-border'>
                <CardTitle className='text-lg font-light'>
                    {filter === 'ALL'
                        ? 'All Orders'
                        : `${filter.charAt(0)}${filter.slice(1).toLowerCase()} Orders`}
                </CardTitle>
                <CardDescription className='font-light'>
                    {counts.ALL} order{counts.ALL === 1 ? '' : 's'} placed so far
                </CardDescription>
            </CardHeader>

            <Tabs value={filter} onValueChange={(value) => setFilter(value as StatusFilter)}>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sidebar-border px-6 py-2.5'>
                    <div className='overflow-x-auto'>
                        <TabsList className='bg-transparent h-auto w-fit p-0 rounded-none gap-1.5'>
                            {FILTERS.map((key) => (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    onClick={() => setPage(1)}
                                    disabled={isPending && counts[key] === 0 && key !== 'ALL'}
                                    className='rounded-full border border-transparent px-3 py-1 text-[11px] font-light tracking-widest uppercase whitespace-nowrap transition-colors shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:border-border cursor-pointer'
                                >
                                    {key === 'ALL' ? 'All' : key}
                                    <span className='tabular-nums opacity-60'>{counts[key]}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <SearchBar
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                        query={query}
                        isFetching={isFetching}
                    />
                </div>

                <CardContent className='p-0'>
                    {isPending ? (
                        <p className='py-16 text-center text-sm font-light text-muted-foreground'>
                            Loading...
                        </p>
                    ) : orders.length === 0 ? (
                        <div className='flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground'>
                            {trimmedQuery ? (
                                <SearchX size={28} strokeWidth={1.5} />
                            ) : (
                                <PackageOpen size={28} strokeWidth={1.5} />
                            )}
                            <p className='text-sm font-light'>
                                {trimmedQuery
                                    ? `No results for "${trimmedQuery}"`
                                    : filter === 'ALL'
                                      ? 'No orders yet'
                                      : `No ${filter.toLowerCase()} orders`}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className='hover:bg-transparent border-sidebar-border'>
                                        <TableHead className='pl-6 font-light'>Order</TableHead>
                                        <TableHead className='font-light'>Customer</TableHead>
                                        <TableHead className='font-light'>Items</TableHead>
                                        <TableHead className='font-light'>Total</TableHead>
                                        <TableHead className='font-light'>Payment</TableHead>
                                        <TableHead className='font-light'>Status</TableHead>
                                        <TableHead className='font-light'>Date</TableHead>
                                        <TableHead className='pr-6 text-right font-light'>
                                            <span className='sr-only'>Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            onClick={() => router.push(`/orders/${order.id}`)}
                                            className='group cursor-pointer border-sidebar-border'
                                        >
                                            <TableCell className='pl-6'>
                                                <span className='font-normal text-foreground group-hover:underline underline-offset-4'>
                                                    #{order.orderNumber}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <div className='font-light text-foreground'>
                                                    {order.email}
                                                </div>
                                                {order.phoneNumber && (
                                                    <div className='text-xs font-light text-muted-foreground'>
                                                        {order.phoneNumber}
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell className='font-light text-muted-foreground'>
                                                {order.items.length}
                                            </TableCell>

                                            <TableCell className='font-normal text-foreground'>
                                                {formatCurrency(order.totalAmount)}
                                            </TableCell>

                                            <TableCell>
                                                <PaymentBadge status={latestPaymentStatus(order)} />
                                            </TableCell>

                                            <TableCell>
                                                <OrderBadge status={order.status} />
                                            </TableCell>

                                            <TableCell className='font-light text-muted-foreground'>
                                                {new Date(order.createdAt).toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </TableCell>

                                            <TableCell className='pr-6 text-right'>
                                                <div
                                                    className='inline-flex items-center gap-1 text-muted-foreground'
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <OrderActions
                                                        orderId={order.id}
                                                        status={order.status}
                                                    />
                                                    <ChevronRight
                                                        size={14}
                                                        className='opacity-0 transition-opacity group-hover:opacity-100'
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination
                                setPage={setPage}
                                page={page}
                                pageSize={pageSize}
                                total={orders.length}
                            />
                        </>
                    )}
                </CardContent>
            </Tabs>
        </Card>
    );
}
