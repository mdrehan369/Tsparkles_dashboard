import { FullProduct } from '@/types/product.types';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '../ui/dialog';
import { Edit2 } from 'lucide-react';
import AddProduct from './AddProduct';
import { useState } from 'react';

type Props = {
    product: FullProduct;
    refetch: () => void;
};

export default function EditProduct({ product, refetch }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='hover:text-primary hover:bg-gray-200 cursor-pointer p-2 border rounded-sm '>
                <Edit2 size={14} className='hover:bg-gray-200' />
            </DialogTrigger>

            <DialogContent
                style={{ maxWidth: 'none', width: '60vw', overflowY: 'scroll', height: '90vh' }}
            >
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Make changes to your product.</DialogDescription>
                <AddProduct
                    isEditing={true}
                    editingProductData={product}
                    onClose={() => {
                        refetch();
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
