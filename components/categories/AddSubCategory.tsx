import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { useState } from 'react';
import { Input } from '../ui/input';
import { useMutation } from '@tanstack/react-query';
import { subCategoryKeys } from '@/constants/querykeys';
import { addSubcategory } from '@/queries/subcategory.queries';
import { Category } from '@/lib/generated/prisma/client';
import toast from 'react-hot-toast';
import axios from 'axios';

function AddSubCategory({
    categoryId,
    refetch,
}: {
    categoryId: Category['id'];
    refetch: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [subcategory, setSubcategory] = useState('');

    const { mutate, isPending } = useMutation({
        mutationKey: subCategoryKeys.ADD_NEW_SUBCATEGORY,
        mutationFn: async () => addSubcategory(categoryId, subcategory),
        onSuccess: () => {
            toast.dismissAll();
            toast.success('Subcategory added successfully!');
            setOpen(false);
            refetch();
        },
        onError: (err) => {
            toast.dismissAll();
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message ?? 'Some error occurred');
            } else {
                toast.error('Some error occurred');
            }
        },
    });

    const handleSubmit = async () => {
        mutate();
    };

    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <div className='flex gap-2'>
                        <Button
                            size='sm'
                            className='hover:bg-gray-200 hover:text-gray-600 cursor-pointer'
                            variant='outline'
                            onClick={() => setOpen(true)}
                        >
                            <Plus size={14} />
                        </Button>
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className='text-xs text-gray-600'>
                    Add Sub-Category
                </HoverCardContent>
            </HoverCard>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent style={{ maxWidth: 'none', width: '30vw', height: '25vh' }}>
                    <DialogTitle>Add Sub Category</DialogTitle>
                    <DialogDescription>Enter the name of the subcategory to add</DialogDescription>
                    <Input
                        type='text'
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                    />
                    <Button disabled={isPending} onClick={handleSubmit}>
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AddSubCategory;
