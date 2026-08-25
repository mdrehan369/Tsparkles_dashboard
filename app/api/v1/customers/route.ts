import { getCustomersPage, getCustomerMetrics } from '@/actions/customers';
import asyncHandler from '@/utils/asyncHandler';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = asyncHandler(
    async (request: NextRequest, _context: { params: Promise<Record<string, never>> }) => {
        const page = Number(request.nextUrl.searchParams.get('page') || 1);
        const search = request.nextUrl.searchParams.get('search') || '';
        const verifiedParam = request.nextUrl.searchParams.get('verified');
        const verified =
            verifiedParam === 'true' ? true : verifiedParam === 'false' ? false : undefined;

        const [customers, metrics] = await Promise.all([
            getCustomersPage({ page, search, verified }),
            page === 1 && !search && verified === undefined ? getCustomerMetrics() : null,
        ]);

        return NextResponse.json({
            success: true,
            message: 'Fetched!',
            data: { ...customers, metrics },
        });
    }
);
