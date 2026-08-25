'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Search,
    SearchX,
    UserCircle,
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
import { formatCurrency } from '@/utils/helpers';
import useDebounce from '@/hooks/use-debounce';
import { getCustomersPage } from '@/actions/customers';
import { customerKeys } from '@/constants/querykeys';
import type { CustomerWithOrders } from '@/types/customer.types';

type VerifiedFilter = 'ALL' | 'VERIFIED' | 'UNVERIFIED';

const FILTERS: { value: VerifiedFilter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'UNVERIFIED', label: 'Unverified' },
];

function getPageWindow(current: number, total: number, size: number = 5): number[] {
    const start = Math.max(1, Math.min(current - Math.floor(size / 2), total - size + 1));
    const end = Math.min(total, start + size - 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
}

function getTotalSpent(orders: CustomerWithOrders['orders']): number {
    return orders
        .filter((o) => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
        .reduce((sum, o) => sum + o.totalAmount, 0);
}

function getLatestOrderDate(orders: CustomerWithOrders['orders']): Date | null {
    if (orders.length === 0) return null;
    return orders.reduce((latest, o) => (o.createdAt > latest ? o.createdAt : latest), orders[0].createdAt);
}

export function CustomerTable() {
    const [filter, setFilter] = useState<VerifiedFilter>('ALL');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const debouncedQuery = useDebounce(query);
    const trimmedQuery = debouncedQuery.trim();

    const { data: customersData, isPending, isFetching } = useQuery({
        queryKey: [...customerKeys.GET_CUSTOMERS, page, trimmedQuery, filter],
        queryFn: () =>
            getCustomersPage({
                page,
                search: trimmedQuery,
                verified: filter === 'ALL' ? undefined : filter === 'VERIFIED',
            }),
        placeholderData: (prev) => prev,
    });

    const customers: CustomerWithOrders[] = customersData?.accounts ?? [];
    const totalEntries = customersData?.total ?? 0;
    const pageSize = customersData?.pageSize ?? 5;
    const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
    const currentPage = Math.min(page, totalPages);
    const rangeStart = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, totalEntries);

    return (
        <Card className='border-sidebar-border gap-0'>
            <CardHeader className='border-b border-sidebar-border'>
                <CardTitle className='text-lg font-light'>All Customers</CardTitle>
                <CardDescription className='font-light'>
                    {totalEntries} customer{totalEntries === 1 ? '' : 's'} in your store
                </CardDescription>
            </CardHeader>

            <Tabs value={filter} onValueChange={(value) => setFilter(value as VerifiedFilter)}>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sidebar-border px-6 py-2.5'>
                    <div className='overflow-x-auto'>
                        <TabsList className='bg-transparent h-auto w-fit p-0 rounded-none gap-1.5'>
                            {FILTERS.map((f) => (
                                <TabsTrigger
                                    key={f.value}
                                    value={f.value}
                                    onClick={() => setPage(1)}
                                    className='rounded-full border border-transparent px-3 py-1 text-[11px] font-light tracking-widest uppercase whitespace-nowrap transition-colors shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:border-border cursor-pointer'
                                >
                                    {f.label}
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
                            placeholder='Search customers'
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
                                <UserCircle size={28} strokeWidth={1.5} />
                            )}
                            <p className='text-sm font-light'>
                                {trimmedQuery
                                    ? `No results for "${trimmedQuery}"`
                                    : 'No customers yet'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className='hover:bg-transparent border-sidebar-border'>
                                        <TableHead className='pl-6 font-light'>
                                            Customer
                                        </TableHead>
                                        <TableHead className='font-light'>Phone</TableHead>
                                        <TableHead className='font-light'>Status</TableHead>
                                        <TableHead className='font-light'>Provider</TableHead>
                                        <TableHead className='font-light'>Orders</TableHead>
                                        <TableHead className='font-light'>Total Spent</TableHead>
                                        <TableHead className='font-light'>Latest Order</TableHead>
                                        <TableHead className='font-light'>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => {
                                        const totalSpent = getTotalSpent(customer.orders);
                                        const latestOrder = getLatestOrderDate(customer.orders);

                                        return (
                                            <TableRow
                                                key={customer.id}
                                                className='group border-sidebar-border'
                                            >
                                                <TableCell className='pl-6'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='size-8 rounded-full bg-muted flex items-center justify-center text-xs font-light text-muted-foreground shrink-0'>
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className='font-normal text-foreground'>
                                                                {customer.name}
                                                            </p>
                                                            <p className='text-xs font-light text-muted-foreground'>
                                                                {customer.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className='font-light text-muted-foreground'>
                                                    {customer.phoneNumber ?? '—'}
                                                </TableCell>

                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-light tracking-widest uppercase ${
                                                            customer.isVerified
                                                                ? 'border-transparent bg-primary text-primary-foreground'
                                                                : 'border-border text-muted-foreground'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`size-1.5 rounded-full ${
                                                                customer.isVerified
                                                                    ? 'bg-primary-foreground'
                                                                    : 'bg-muted-foreground/40'
                                                            }`}
                                                        />
                                                        {customer.isVerified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span className='rounded-full border border-border px-2.5 py-0.5 text-[11px] font-light tracking-widest uppercase text-muted-foreground'>
                                                        {customer.oAuthProvider.toLowerCase()}
                                                    </span>
                                                </TableCell>

                                                <TableCell className='font-light text-foreground tabular-nums'>
                                                    {customer._count.orders}
                                                </TableCell>

                                                <TableCell className='font-normal text-foreground tabular-nums'>
                                                    {totalSpent > 0 ? formatCurrency(totalSpent) : '₹0'}
                                                </TableCell>

                                                <TableCell className='font-light text-muted-foreground'>
                                                    {latestOrder
                                                        ? latestOrder.toLocaleDateString('en-IN', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '—'}
                                                </TableCell>

                                                <TableCell className='font-light text-muted-foreground'>
                                                    {new Date(customer.createdAt).toLocaleDateString(
                                                        'en-IN',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
