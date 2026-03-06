import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { DotSquare } from 'lucide-react';

function OrderActions({ orderId }: { orderId: number }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='p-2 rounded-md hover:bg-gray-100'>
                    <DotSquare />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
                <DropdownMenuContent
                    className='bg-white rounded-lg shadow-md border p-2 text-sm'
                    sideOffset={5}
                >
                    <DropdownMenuItem className='px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer'>
                        View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem className='px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer'>
                        Mark as Shipped
                    </DropdownMenuItem>

                    <DropdownMenuItem className='px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-red-600'>
                        Cancel Order
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}

export default OrderActions;
