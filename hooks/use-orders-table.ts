import { OrderStatus } from '@/lib/generated/prisma/enums';
import { useMemo, useState } from 'react';
import useDebounce from './use-debounce';
import { useQuery } from '@tanstack/react-query';
import { orderKeys } from '@/constants/querykeys';
import { getOrdersPage, getOrdersStatusCounts } from '@/actions/orders';
import { OrderWithRelations } from '@/types/order.types';

export type StatusFilter = 'ALL' | OrderStatus;

export const FILTERS: StatusFilter[] = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
];

export default function useOrdersTable() {
    const [filter, setFilter] = useState<StatusFilter>('ALL');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const debouncedQuery = useDebounce(query);
    const trimmedQuery = debouncedQuery.trim();

    const { data: countsData } = useQuery({
        queryKey: [...orderKeys.ORDER_STATUS_COUNTS, trimmedQuery],
        queryFn: () => getOrdersStatusCounts({ search: trimmedQuery }),
    });

    const counts = useMemo(() => {
        const map = {} as Record<StatusFilter, number>;
        for (const key of FILTERS) map[key] = 0;
        return { ...map, ...countsData };
    }, [countsData]);

    const {
        data: ordersData,
        isPending,
        isFetching,
    } = useQuery({
        queryKey: [...orderKeys.GET_ORDERS, page, trimmedQuery, filter],
        queryFn: () =>
            getOrdersPage({
                page,
                search: trimmedQuery,
                status: filter === 'ALL' ? undefined : filter,
            }),
        placeholderData: (prev) => prev,
    });

    const orders: OrderWithRelations[] = ordersData?.orders ?? [];
    const pageSize = ordersData?.pageSize || 10;

    return {
        counts,
        orders,
        isPending,
        isFetching,
        filter,
        setFilter,
        setPage,
        setQuery,
        trimmedQuery,
        query,
        page,
        pageSize,
    };
}
