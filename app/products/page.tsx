'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/layout';
import { Product, SubCategory } from '@/prisma/generated/prisma/client';
import { useQuery } from '@tanstack/react-query';
import { CategoryWithSubCategory } from '@/types/category.types';
import { fetchAllCategories } from '@/queries/category';
import { categoryKeys } from '@/constants/querykeys';
import AddProduct from '@/components/products/AddProduct';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [showForm, setShowForm] = useState(false);

    const { data: categories, isLoading: loading } = useQuery<CategoryWithSubCategory[]>({
        initialData: [],
        queryKey: categoryKeys.GET_ALL_CATEGORIES,
        queryFn: () => fetchAllCategories(1, 15, ''),
    });

    const getCategoryName = (id: number) => categories?.find((c) => c.id === id)?.name;
    const getSubCategoryName = (id: number) => subCategories.find((s) => s.id === id)?.name;

    return (
        <DashboardLayout>
            <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-light tracking-tight text-foreground'>
                            Products
                        </h1>
                        <p className='text-sm text-muted-foreground mt-2'>
                            Manage your product catalog
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className='gap-2'>
                        <Plus size={16} />
                        Add Product
                    </Button>
                </div>

                {showForm && (
                    <AddProduct categories={categories} onClose={() => setShowForm(false)} />
                )}

                <Card className='border-sidebar-border'>
                    <CardHeader className='border-b border-sidebar-border'>
                        <CardTitle className='text-lg font-light'>All Products</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        {loading ? (
                            <p className='text-muted-foreground'>Loading...</p>
                        ) : products.length === 0 ? (
                            <p className='text-muted-foreground'>No products yet</p>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm'>
                                    <thead>
                                        <tr className='border-b border-sidebar-border'>
                                            <th className='text-left py-3 px-4 font-light text-foreground'>
                                                Title
                                            </th>
                                            <th className='text-left py-3 px-4 font-light text-foreground'>
                                                Price
                                            </th>
                                            <th className='text-left py-3 px-4 font-light text-foreground'>
                                                Category
                                            </th>
                                            <th className='text-left py-3 px-4 font-light text-foreground'>
                                                Sub-Category
                                            </th>
                                            <th className='text-right py-3 px-4 font-light text-foreground'>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className='border-b border-sidebar-border hover:bg-sidebar/50 transition-colors'
                                            >
                                                <td className='py-3 px-4'>
                                                    <p className='font-light text-foreground'>
                                                        {product.title}
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>
                                                        {product.slug}
                                                    </p>
                                                </td>
                                                <td className='py-3 px-4 font-light text-foreground'>
                                                    ${product.price.toFixed(2)}
                                                    {product.comparePrice && (
                                                        <p className='text-xs text-muted-foreground line-through'>
                                                            ${product.comparePrice.toFixed(2)}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className='py-3 px-4 font-light text-foreground'>
                                                    {getCategoryName(product.categoryId)}
                                                </td>
                                                <td className='py-3 px-4 font-light text-foreground'>
                                                    {getSubCategoryName(product.subCategoryId)}
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex justify-end gap-2'>
                                                        <Button size='sm' variant='outline'>
                                                            <Edit2 size={14} />
                                                        </Button>
                                                        <Button size='sm' variant='outline'>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
