import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UpdateCategorySchema, UpdateCategorySchemaType } from '@/zod/category';
import toast from 'react-hot-toast';
import uploadAsset from '@/utils/upload';
import { CategoryWithSubCategory } from '@/types/category.types';
import deleteAsset from '@/actions/assetManagement';
import FileUpload from '../products/FileUpload';

interface Props {
    onClose: () => void;
    isEditing?: boolean;
    category: CategoryWithSubCategory;
}

export default function UpdateCategory({ onClose, isEditing = false, category }: Props) {
    const [freeze, setFreeze] = useState(false);
    const [file, setFile] = useState<File[]>([]);
    const [deleted, setDeleted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateCategorySchemaType>({
        resolver: zodResolver(UpdateCategorySchema),
        defaultValues: {
            name: category.name,
            backgroundColor: category?.backgroundColor ?? '#000000',
        },
    });

    const submit = async (data: UpdateCategorySchemaType) => {
        try {
            let uploadedAsset = null;

            if (file.length) {
                toast.loading('Uploading image...');
                uploadedAsset = await uploadAsset({
                    name: data.name || category.name,
                    file: file[0],
                });
                toast.dismiss();
            }

            toast.loading(isEditing ? 'Updating Category...' : 'Creating Category...');

            const payload = {
                name: data.name,
                backgroundColor: data.backgroundColor,
                asset: uploadedAsset,
            };
            await updateCategory(category!.id, payload);

            toast.dismiss();
            toast.success(
                isEditing ? 'Category updated successfully' : 'Category created successfully'
            );

            reset();
            onClose();
        } catch (err) {
            toast.dismiss();
            toast.error('Something went wrong');
        }
    };

    const handleDeleteImage = async () => {
        if (!category?.image || freeze) return;

        try {
            setFreeze(true);

            toast.loading('Deleting image...');

            if (category.image) await deleteAsset(category.image.fileId);

            setDeleted(true);

            toast.dismiss();
            toast.success('Image deleted');
        } catch {
            toast.dismiss();
            toast.error('Failed to delete image');
        } finally {
            setFreeze(false);
        }
    };

    return (
        <Card className='border-sidebar-border'>
            <CardHeader className='border-b border-sidebar-border'>
                <CardTitle className='text-lg font-light'>
                    {isEditing ? 'Update Category' : 'Add Category'}
                </CardTitle>
            </CardHeader>

            <CardContent className='pt-6'>
                <form onSubmit={handleSubmit(submit)} className='space-y-5'>
                    <Input placeholder='Category Name' {...register('name')} disabled={freeze} />

                    <Input
                        type='color'
                        {...register('backgroundColor')}
                        disabled={freeze}
                        className='h-12'
                    />

                    {isEditing && category?.image && !deleted && (
                        <div className='relative w-40 h-40'>
                            <Image
                                src={category?.image.url}
                                alt={category.name}
                                fill
                                className='object-cover rounded-md'
                            />

                            <button
                                type='button'
                                onClick={handleDeleteImage}
                                className='absolute inset-0 bg-black/50 flex items-center justify-center'
                            >
                                <Trash2 className='text-red-400' />
                            </button>
                        </div>
                    )}

                    <FileUpload files={file} setFiles={setFile} />

                    <div className='flex gap-3'>
                        <Button type='submit' className='flex-1' disabled={isSubmitting || freeze}>
                            {isEditing ? 'Save' : 'Create'}
                        </Button>

                        <Button
                            type='button'
                            variant='outline'
                            className='flex-1'
                            onClick={onClose}
                            disabled={isSubmitting || freeze}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
