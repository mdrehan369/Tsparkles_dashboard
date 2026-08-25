import { type NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/repositories/product';

export async function GET(req: NextRequest) {
    const queryParams = req.nextUrl.searchParams;

    const page = Number(queryParams.get('page')) || 1;
    const limit = Number(queryParams.get('limit')) || 15;
    const search = queryParams.get('search') || '';

    const data = await getProducts({ page, limit, search });

    return NextResponse.json({
        success: true,
        message: 'Fetched',
        data,
    });
}
