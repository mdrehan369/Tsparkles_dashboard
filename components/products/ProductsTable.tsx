import { productKeys } from '@/constants/querykeys';
import { cn } from '@/lib/utils';
import { fetchAllProducts } from '@/queries/product';
import { useQuery } from '@tanstack/react-query';
import { Image } from '@imagekit/next';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Prisma } from '@/prisma/generated/prisma/client';

export default function ProductsTable() {
    const { data: products, isLoading: loading } = useQuery<
        Prisma.ProductGetPayload<{ include: { Asset: true; Category: true; SubCategory: true } }>[]
    >({
        initialData: [],
        queryKey: productKeys.GET_ALL_PRODUCTS,
        queryFn: () => fetchAllProducts(),
    });

    return loading ? (
        <p className='text-muted-foreground'>Loading...</p>
    ) : products.length === 0 ? (
        <p className='text-muted-foreground'>No products yet</p>
    ) : (
        <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='border-b border-sidebar-border'>
                        <th className='text-left py-3 px-4 font-light text-foreground'>Title</th>
                        <th className='text-left py-3 px-4 font-light text-foreground'>Price</th>
                        <th className='text-left py-3 px-4 font-light text-foreground'>Category</th>
                        <th className='text-left py-3 px-4 font-light text-foreground'>
                            Sub-Category
                        </th>
                        <th className='text-right py-3 px-4 font-light text-foreground'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        return (
                            <tr
                                key={product.id}
                                className={cn(
                                    'border-b border-sidebar-border transition-colors',
                                    'hover:bg-sidebar/60',
                                    index % 2 === 0 && 'bg-sidebar/20'
                                )}
                            >
                                {/* Image */}
                                <td className='py-3 px-4 flex items-center gap-4'>
                                    <div className='h-12 w-12 overflow-hidden rounded-md border bg-muted'>
                                        {product.Asset[0] ? (
                                            <Image
                                                src={product.Asset[0].url}
                                                alt={product.title}
                                                className='h-full w-full object-cover transition-transform duration-200 hover:scale-110'
                                                width={500}
                                                height={500}
                                                loading='lazy'
                                            />
                                        ) : (
                                            <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className=''>
                                        <p className='font-medium text-foreground leading-none'>
                                            {product.title}
                                        </p>
                                        <p className='mt-1 text-xs text-muted-foreground'>
                                            #{product.slug}
                                        </p>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className='py-3 px-4 text-foreground'>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>
                                            ${product.price.toFixed(2)}
                                        </span>

                                        <span className='text-xs text-destructive line-through'>
                                            ${product.comparePrice!.toFixed(2)}
                                        </span>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className='py-3 px-4'>
                                    <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                                        {product.Category.name}
                                    </span>
                                </td>

                                {/* Sub Category */}
                                <td className='py-3 px-4'>
                                    <span className='inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground'>
                                        {product.SubCategory.name}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className='py-3 px-4'>
                                    <div className='flex justify-end gap-2'>
                                        <Button
                                            size='icon'
                                            variant='outline'
                                            className='hover:text-primary hover:bg-gray-200 cursor-pointer'
                                        >
                                            <Edit2 size={14} className='hover:bg-gray-100' />
                                        </Button>

                                        <Button
                                            size='icon'
                                            variant='outline'
                                            className='hover:text-destructive hover:bg-red-200 cursor-pointer'
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
