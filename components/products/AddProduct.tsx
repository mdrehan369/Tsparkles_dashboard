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
import { CategoryWithSubCategory } from '@/types/category.types';
import { AddProductFormSchema } from '@/zod/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import FileUpload from './FileUpload';
import { useState } from 'react';
import uploadAsset from '@/utils/upload';
import { addProduct } from '@/actions/products';

export default function AddProduct({
    categories,
    onClose,
}: {
    categories: CategoryWithSubCategory[];
    onClose: () => void;
}) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        formState: { isSubmitting },
    } = useForm<z.infer<typeof AddProductFormSchema>>({
        resolver: zodResolver(AddProductFormSchema),
    });
    const [files, setFiles] = useState<File[]>([]);

    const submit = async (data: z.infer<typeof AddProductFormSchema>) => {
        try {
            console.log(data);
            const uploadFiles = [];
            for (const file of files) {
                const uploadedFile = await uploadAsset({ name: 'test', file });
                if (uploadedFile) uploadFiles.push(uploadedFile);
            }

            if (uploadFiles.length == 0) throw new Error('Upload assets for product');

            const { title, price, comparePrice, description, category, subCategory } = data;
            const newProduct = await addProduct({
                title,
                description,
                comparePrice,
                price,
                categoryId: category,
                subCategoryId: subCategory,
                files: uploadFiles,
            });

            console.log(newProduct);

            reset();
            setFiles([]);
            onClose();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Card className='border-sidebar-border'>
            <CardHeader className='border-b border-sidebar-border'>
                <CardTitle className='text-lg font-light'>Add New Product</CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
                <form onSubmit={handleSubmit(submit)} className='space-y-4'>
                    <Input placeholder='Product title' {...register('title')} required />
                    <Textarea
                        placeholder='Product Description'
                        {...register('description')}
                        required
                    />
                    <div className='grid grid-cols-2 gap-4'>
                        <Input
                            placeholder='Price'
                            type='number'
                            step='1'
                            {...register('price', { valueAsNumber: true })}
                            required
                        />
                        <Input
                            placeholder='Compare price'
                            type='number'
                            step='1'
                            {...register('comparePrice', { valueAsNumber: true })}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <Controller
                            control={control}
                            name='category'
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
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
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
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
                    <FileUpload files={files} setFiles={setFiles} />
                    <div className='flex gap-2'>
                        <Button type='submit' className='flex-1' disabled={isSubmitting}>
                            Add Product
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onClose()}
                            className='flex-1'
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
