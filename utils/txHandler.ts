import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export default async function txHandler(
    fn: (tx: Prisma.TransactionClient) => Promise<NextResponse>
) {
    return await prisma.$transaction(async (tx) => {
        return await fn(tx);
    });
}
