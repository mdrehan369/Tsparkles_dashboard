'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AddProductFormSchema, AddProductFormType, EditProductFormDataType } from '@/zod/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import FileUpload from './FileUpload';
import { useState } from 'react';
import uploadAsset from '@/utils/upload';
import { addProduct, deleteProductAsset, updateProduct } from '@/actions/products';
import { CategoryWithSubCategory } from '@/types/category.types';
import { fetchAllCategories } from '@/queries/category';
import { categoryKeys } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FullProduct } from '@/types/product.types';
import { Image } from '@imagekit/next';
import { Trash2 } from 'lucide-react';
import deleteAsset from '@/actions/assetManagement';
import { deleteAssetFromProductRepo } from '@/repositories/product';

type Props = {
    onClose: () => void;
    isEditing?: boolean;
    editingProductData?: FullProduct;
};

export default function AddProduct({ onClose, isEditing = false, editingProductData }: Props) {
    const { data: categories } = useQuery<CategoryWithSubCategory[]>({
        initialData: [],
        queryKey: categoryKeys.GET_ALL_CATEGORIES,
        queryFn: () => fetchAllCategories(1, 15, ''),
    });
    const [freeze, setFreeze] = useState(false);
    const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        formState: { isSubmitting },
    } = useForm<AddProductFormType>({
        resolver: zodResolver(AddProductFormSchema),
        defaultValues: async () => {
            if (isEditing && editingProductData) {
                const product: EditProductFormDataType = {
                    comparePrice: editingProductData.comparePrice || 0,
                    price: editingProductData.price,
                    description: editingProductData.description || '',
                    title: editingProductData.title,
                    category: editingProductData.Category.id,
                    subCategory: editingProductData.SubCategory.id,
                };
                return product;
            }
            return {
                price: 0,
                title: '',
                category: 0,
                description: '',
                subCategory: 0,
                comparePrice: 0,
            };
        },
    });
    const [files, setFiles] = useState<File[]>([]);

    const submit = async (data: AddProductFormType) => {
        try {
            let toastId = toast.loading('Uploading Images...');
            const uploadFiles = [];
            for (const file of files) {
                const uploadedFile = await uploadAsset({ name: 'test', file });
                if (uploadedFile) uploadFiles.push(uploadedFile);
            }

            if (uploadFiles.length == 0 && !isEditing)
                throw new Error('Please upload assets for product');

            const { title, price, comparePrice, description, category, subCategory } = data;
            toast.dismiss(toastId);
            toastId = toast.loading(!isEditing ? 'Adding Product...' : 'Updating Product...');
            const payload = {
                title,
                description,
                comparePrice,
                price,
                categoryId: category,
                subCategoryId: subCategory,
                files: uploadFiles,
            };
            if (isEditing) await updateProduct(editingProductData!.id, payload);
            else await addProduct(payload);
            toast.dismiss(toastId);
            toast.success(
                !isEditing ? 'Product Added Successfully!' : 'Product Updated Successfully!'
            );
            reset();
            setFiles([]);
            onClose();
        } catch (e) {
            console.log(e);
            toast.dismissAll();
            toast.error('Some error occured');
        }
    };

    const handleDeleteAsset = async (fileId: string) => {
        if (freeze) return;
        try {
            setFreeze(true);
            toast.loading('Deleting asset...');
            await deleteAsset(fileId);
            await deleteProductAsset(editingProductData!.id, fileId);
            setDeletedFileIds((prev) => [...prev, fileId]);
            toast.dismissAll();
            toast.success('Asset deleted successfully');
        } catch (e: any) {
            toast.dismissAll();
            toast.error('Some error occured while deleting');
        } finally {
            setFreeze(false);
        }
    };

    return (
        <Card className='border-sidebar-border h-full overflow-y-scroll'>
            {!isEditing && (
                <CardHeader className='border-b border-sidebar-border'>
                    <CardTitle className='text-lg font-light'>Add New Product</CardTitle>
                </CardHeader>
            )}
            <CardContent className='pt-6 overflow-y-scroll'>
                <form onSubmit={handleSubmit(submit)} className='space-y-4'>
                    <Input placeholder='Product title' {...register('title')} required />
                    <Textarea
                        className='resize-none'
                        placeholder='Product Description'
                        {...register('description')}
                        required
                        disabled={freeze}
                    />
                    <div className='grid grid-cols-2 gap-4'>
                        <Input
                            placeholder='Price'
                            type='number'
                            step='1'
                            {...register('price', { valueAsNumber: true })}
                            required
                            disabled={freeze}
                        />
                        <Input
                            placeholder='Compare price'
                            type='number'
                            step='1'
                            {...register('comparePrice', { valueAsNumber: true })}
                            disabled={freeze}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <Controller
                            control={control}
                            name='category'
                            disabled={freeze}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                    defaultValue={editingProductData?.categoryId.toString() || '0'}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Controller
                            control={control}
                            name='subCategory'
                            disabled={freeze}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                    defaultValue={
                                        editingProductData?.subCategoryId.toString() || '0'
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select Sub Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories
                                            ?.find((cat) => cat.id === Number(watch('category')))
                                            ?.SubCategory.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {isEditing && editingProductData && (
                        <div className='w-full flex items-center justify-start gap-3 overflow-x-scroll p-3'>
                            {editingProductData.Asset.map(
                                (asset) =>
                                    !deletedFileIds.includes(asset.fileId) && (
                                        <div className='w-28 h-28 relative z-20' key={asset.id}>
                                            <div className='absolute flex items-center justify-center z-10 bg-black/50 transition-colors w-full h-full'>
                                                <Trash2
                                                    onClick={() => handleDeleteAsset(asset.fileId)}
                                                    className=' bg-black/60 text-red-400 size-10 p-2 rounded-xs hover:bg-black/80 cursor-pointer'
                                                />
                                            </div>
                                            <Image
                                                src={asset.url}
                                                alt={editingProductData.title}
                                                className='object-cover z-0 transition-transform duration-200'
                                                loading='lazy'
                                                fill
                                            />
                                        </div>
                                    )
                            )}
                        </div>
                    )}
                    <FileUpload files={files} setFiles={setFiles} />
                    <div className='flex gap-2'>
                        <Button type='submit' className='flex-1' disabled={isSubmitting || freeze}>
                            {isEditing ? 'Save' : 'Add Product'}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onClose()}
                            className='flex-1'
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
