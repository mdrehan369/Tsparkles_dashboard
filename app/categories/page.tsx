'use client';

import type React from 'react';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/dashboard/layout';
import { Prisma } from '@/prisma/generated/prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { categoryKeys } from '@/constants/querykeys';
import { addCategory, deleteCategory, fetchAllCategories } from '@/queries/category';
import SubCategoryHoverCard from '@/components/categories/HoverCard';

export default function CategoriesPage() {
    const [newCategory, setNewCategory] = useState('');

    const {
        data: categories,
        isLoading: loading,
        refetch,
    } = useQuery<
        Prisma.CategoryGetPayload<{
            include: { SubCategory: { include: { Product: { include: { _count: true } } } } };
        }>[]
    >({
        initialData: [],
        queryKey: categoryKeys.GET_ALL_CATEGORIES,
        queryFn: () => fetchAllCategories(1, 15, ''),
    });

    const { mutate } = useMutation({
        mutationFn: addCategory,
        mutationKey: categoryKeys.ADD_NEW_CATEGORY,
        onSuccess: () => {
            refetch();
            setNewCategory('');
        },
    });

    const { mutate: deleteCategoryMutation } = useMutation({
        mutationFn: deleteCategory,
        mutationKey: categoryKeys.ADD_NEW_CATEGORY,
        onSuccess: () => {
            refetch();
        },
    });

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        mutate(newCategory.trim());
    };

    const handleDeleteCategory = async (name: string) => {
        deleteCategoryMutation(name);
    };

    return (
        <DashboardLayout>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-light tracking-tight text-foreground'>
                        Categories
                    </h1>
                    <p className='text-sm text-muted-foreground mt-2'>
                        Manage your product categories
                    </p>
                </div>

                <Card className='border-sidebar-border'>
                    <CardHeader className='border-b border-sidebar-border'>
                        <CardTitle className='text-lg font-light'>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <form onSubmit={handleAddCategory} className='flex gap-2'>
                            <Input
                                placeholder='Category name'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className='flex-1'
                            />
                            <Button type='submit' className='gap-2'>
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
                                        <div>
                                            <p className='font-light text-foreground'>
                                                {category.name}
                                            </p>
                                            <p className='text-xs text-muted-foreground'>
                                                Created{' '}
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <SubCategoryHoverCard category={category} />
                                            <div className='flex gap-2'>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    className='hover:bg-red-200 hover:text-red-600 cursor-pointer'
                                                    onClick={() =>
                                                        handleDeleteCategory(category.name)
                                                    }
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
        </DashboardLayout>
    );
}
