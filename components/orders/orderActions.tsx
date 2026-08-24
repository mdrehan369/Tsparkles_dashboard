'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderStatus } from '@/lib/generated/prisma/enums';
import { updateOrderStatus } from '@/actions/orders';
import { useRouter } from 'next/navigation';

function OrderActions({ orderId, status }: { orderId: number; status: OrderStatus }) {
    const router = useRouter();
    const handleOrderUpdate = async () => {
        const newStatus =
            status == OrderStatus.PENDING ? OrderStatus.SHIPPED : OrderStatus.DELIVERED;
        await updateOrderStatus(orderId, newStatus);
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='size-8 text-muted-foreground hover:text-foreground cursor-pointer'
                >
                    <MoreHorizontal size={16} />
                    <span className='sr-only'>Order actions</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' sideOffset={5} className='w-44'>
                <DropdownMenuItem asChild>
                    <Link href={`/orders/${orderId}`} className='cursor-pointer font-light'>
                        View Details
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className='cursor-pointer font-light'
                    onClick={() => handleOrderUpdate()}
                >
                    {status == OrderStatus.PENDING
                        ? 'Mark as Shipped'
                        : status == OrderStatus.SHIPPED
                          ? 'Mark as Delivered'
                          : 'Already Delivered!'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className='cursor-pointer font-light text-destructive focus:text-destructive'
                    variant='destructive'
                >
                    Cancel Order
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default OrderActions;
