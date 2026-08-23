'use client';

import type React from 'react';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { categoryKeys } from '@/constants/querykeys';
import { addCategory, deleteCategory, fetchAllCategories } from '@/queries/category';
import SubCategoryHoverCard from '@/components/categories/HoverCard';
import { CategoryWithSubCategory } from '@/types/category.types';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddSubCategory from '@/components/categories/AddSubCategory';
import UpdateCategory from '@/components/categories/EditCategory';

export default function CategoriesPage() {
    const [newCategory, setNewCategory] = useState('');

    const {
        data: categories,
        isLoading: loading,
        refetch,
    } = useQuery<CategoryWithSubCategory[]>({
        initialData: [],
        queryKey: categoryKeys.GET_ALL_CATEGORIES,
        queryFn: () => fetchAllCategories(1, 15, ''),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: addCategory,
        mutationKey: categoryKeys.ADD_NEW_CATEGORY,
        onSuccess: () => {
            refetch();
            setNewCategory('');
            toast.success('Category added successfully!');
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message ?? 'Some error occurred');
            } else {
                toast.error('Some error occurred');
            }
            setNewCategory('');
        },
    });

    const { mutate: deleteCategoryMutation } = useMutation({
        mutationFn: deleteCategory,
        mutationKey: categoryKeys.ADD_NEW_CATEGORY,
        onSuccess: () => {
            toast.success('Deleted category successfully!');
            refetch();
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message ?? 'Some error occurred');
            } else {
                toast.error('Some error occurred');
            }
            console.log(err);
        },
    });

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim() == '') {
            toast.error('Please enter a valid name');
            return;
        }

        mutate({
            name: newCategory.trim(),
        });
    };

    const handleDeleteCategory = async (name: string) => {
        deleteCategoryMutation(name);
    };

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-light tracking-tight text-foreground'>Categories</h1>
                <p className='text-sm text-muted-foreground mt-2'>Manage your product categories</p>
            </div>

            <Card className='border-sidebar-border'>
                <CardHeader className='border-b border-sidebar-border'>
                    <CardTitle className='text-lg font-light'>Add New Category</CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                    <form onSubmit={handleAddCategory} className='flex gap-2'>
                        <div className='flex gap-2 w-full'>
                            <Input
                                placeholder='Category name'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className='flex-1'
                            />
                        </div>
                        <Button type='submit' className='gap-2' disabled={isPending}>
                            <Plus size={16} />
                            Add Category
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className='border-sidebar-border'>
                <CardHeader className='border-b border-sidebar-border'>
                    <CardTitle className='text-lg font-light'>All Categories</CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                    {loading ? (
                        <p className='text-muted-foreground'>Loading...</p>
                    ) : categories.length === 0 ? (
                        <p className='text-muted-foreground'>No categories yet</p>
                    ) : (
                        <div className='space-y-2'>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className='flex items-center justify-between p-4 rounded-lg border border-sidebar-border hover:bg-sidebar/50 transition-colors'
                                >
                                    <div className='flex items-center justify-start gap-10'>
                                        <div>
                                            <p className='font-light text-foreground'>
                                                {category.name}
                                            </p>
                                            <p className='text-xs text-muted-foreground'>
                                                Created{' '}
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <AddSubCategory
                                            refetch={refetch}
                                            categoryId={category.id}
                                        />
                                        <SubCategoryHoverCard category={category} />
                                        <UpdateCategory
                                            category={category}
                                            refetch={refetch}
                                        />
                                        <div className='flex gap-2'>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                className='hover:bg-red-200 hover:text-red-600 cursor-pointer'
                                                onClick={() => handleDeleteCategory(category.name)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
