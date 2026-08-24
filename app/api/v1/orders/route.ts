import { OrderStatus } from '@/lib/generated/prisma/client';
import { getOrdersPage } from '@/actions/orders';
import asyncHandler from '@/utils/asyncHandler';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = asyncHandler(
    async (request: NextRequest, _context: { params: Promise<Record<string, never>> }) => {
        const page = Number(request.nextUrl.searchParams.get('page') || 1);
        const search = request.nextUrl.searchParams.get('search') || '';
        const statusParam = request.nextUrl.searchParams.get('status');
        const status =
            statusParam && statusParam in OrderStatus
                ? (statusParam as OrderStatus)
                : undefined;

        const result = await getOrdersPage({ page, search, status });

        return NextResponse.json({ success: true, message: 'Fetched!', data: result });
    }
);
