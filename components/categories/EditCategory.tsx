import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { UpdateCategorySchema, UpdateCategorySchemaType } from '@/zod/category';
import { categoryKeys } from '@/constants/querykeys';
import { updateCategory } from '@/queries/category';
import { CategoryWithSubCategory } from '@/types/category.types';

function UpdateCategory({
    category,
    refetch,
}: {
    category: CategoryWithSubCategory;
    refetch: () => void;
}) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateCategorySchemaType>({
        resolver: zodResolver(UpdateCategorySchema),
        defaultValues: {
            name: category.name,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationKey: categoryKeys.UPDATE_CATEGORY,
        mutationFn: async (data: UpdateCategorySchemaType) => updateCategory(category.id, data),
        onSuccess: () => {
            toast.dismissAll();
            toast.success('Category updated successfully!');
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

    const submit = (data: UpdateCategorySchemaType) => mutate(data);

    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <Button
                        size='sm'
                        variant='outline'
                        className='hover:bg-blue-200 hover:text-blue-600 cursor-pointer'
                        onClick={() => {
                            reset({ name: category.name });
                            setOpen(true);
                        }}
                    >
                        <Pencil size={14} />
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className='text-xs text-gray-600'>Edit Category</HoverCardContent>
            </HoverCard>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent style={{ maxWidth: 'none', width: '30vw', height: '25vh' }}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Update the name of this category</DialogDescription>
                    <form onSubmit={handleSubmit(submit)} className='space-y-4'>
                        <Input
                            placeholder='Category Name'
                            {...register('name')}
                            disabled={isPending || isSubmitting}
                        />
                        <div className='flex gap-3'>
                            <Button
                                type='submit'
                                className='flex-1'
                                disabled={isPending || isSubmitting}
                            >
                                Save
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                className='flex-1'
                                onClick={() => setOpen(false)}
                                disabled={isPending || isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UpdateCategory;
