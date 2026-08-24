'use client';

import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    PackageOpen,
    Search,
    SearchX,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrderActions from '@/components/orders/orderActions';
import OrderBadge from '@/components/orders/orderBadge';
import PaymentBadge from '@/components/orders/paymentBadge';
import { PaymentStatus } from '@/lib/generated/prisma/client';
import { formatCurrency } from '@/utils/helpers';
import type { OrderWithRelations } from '@/types/order.types';
import useOrdersTable, { FILTERS, StatusFilter } from '@/hooks/use-orders-table';

function latestPaymentStatus(order: OrderWithRelations): PaymentStatus {
    const sorted = [...order.payments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0]?.paymentStatus ?? 'PENDING';
}

function getPageWindow(current: number, total: number, size: number = 5): number[] {
    const start = Math.max(1, Math.min(current - Math.floor(size / 2), total - size + 1));
    const end = Math.min(total, start + size - 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
}

export function OrdersTable() {
    const router = useRouter();

    const {
        isFetching,
        isPending,
        rangeEnd,
        rangeStart,
        currentPage,
        totalEntries,
        totalPages,
        orders,
        counts,
        filter,
        setQuery,
        trimmedQuery,
        setPage,
        setFilter,
        query,
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

                    <div className='relative w-full sm:w-64 shrink-0'>
                        <Search
                            size={14}
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'
                        />
                        <Input
                            placeholder='Search orders or products'
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            className='pl-8 pr-8 h-8 font-light text-sm bg-transparent'
                        />
                        {isFetching && (
                            <LoaderCircle
                                size={14}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin'
                            />
                        )}
                    </div>
                </div>

                <CardContent className='p-0'>
                    {isPending ? (
                        <p className='py-16 text-center text-sm font-light text-muted-foreground'>
                            Loading...
                        </p>
                    ) : totalEntries === 0 ? (
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

                            <div className='flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sidebar-border px-6 py-3'>
                                <p className='text-xs font-light text-muted-foreground'>
                                    Showing {rangeStart}–{rangeEnd} of {totalEntries} entr
                                    {totalEntries === 1 ? 'y' : 'ies'}
                                </p>
                                {totalPages > 1 && (
                                    <div className='flex items-center gap-1'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='size-7 rounded-full cursor-pointer'
                                            disabled={currentPage === 1}
                                            onClick={() => setPage(currentPage - 1)}
                                        >
                                            <ChevronLeft size={14} />
                                            <span className='sr-only'>Previous page</span>
                                        </Button>
                                        {getPageWindow(currentPage, totalPages).map((p) => (
                                            <Button
                                                key={p}
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => setPage(p)}
                                                className={`size-7 rounded-full text-xs tabular-nums cursor-pointer ${
                                                    p === currentPage
                                                        ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {p}
                                            </Button>
                                        ))}
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='size-7 rounded-full cursor-pointer'
                                            disabled={currentPage === totalPages}
                                            onClick={() => setPage(currentPage + 1)}
                                        >
                                            <ChevronRight size={14} />
                                            <span className='sr-only'>Next page</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Tabs>
        </Card>
    );
}
