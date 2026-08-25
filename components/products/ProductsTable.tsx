import { cn } from '@/lib/utils';
import { Image } from '@imagekit/next';
import { Trash2 } from 'lucide-react';
import ConfirmationBox from '../common/ConfirmationBox';
import EditProduct from './EditProduct';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import useProductsTable from '@/hooks/use-products-table';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';

export default function ProductsTable() {
    const {
        currPage,
        setCurrPage,
        onPublishStatusChange,
        handleDeleteProduct,
        totalEntries,
        products,
        refetch,
        pageSize,
        query,
        setQuery,
        isFetching,
    } = useProductsTable();

    return (
        <div className='overflow-x-auto'>
            <SearchBar
                onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrPage(1);
                }}
                query={query}
                isFetching={isFetching}
            />
            {isFetching ? (
                <p className='text-muted-foreground mt-6'>Loading...</p>
            ) : products.length === 0 ? (
                <p className='text-muted-foreground mt-6'>No products yet</p>
            ) : (
                <>
                    <Table className='w-full text-sm'>
                        <TableHeader>
                            <TableRow className='border-b border-sidebar-border'>
                                <TableHead className='text-left py-3 px-4 font-light text-foreground'>
                                    Title
                                </TableHead>
                                <TableHead className='text-left py-3 px-4 font-light text-foreground'>
                                    Price
                                </TableHead>
                                <TableHead className='text-left py-3 px-4 font-light text-foreground'>
                                    Category
                                </TableHead>
                                <TableHead className='text-left py-3 px-4 font-light text-foreground'>
                                    Sub-Category
                                </TableHead>
                                <TableHead className='text-left py-3 px-4 font-light text-foreground'>
                                    Published
                                </TableHead>
                                <TableHead className='text-right py-3 px-4 font-light text-foreground'>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => {
                                return (
                                    <TableRow
                                        key={product.id}
                                        className={cn(
                                            'border-b border-sidebar-border transition-colors',
                                            'hover:bg-sidebar/60',
                                            index % 2 === 0 && 'bg-sidebar/20'
                                        )}
                                    >
                                        {/* Image */}
                                        <TableCell className='py-3 px-4 flex items-center gap-4'>
                                            <div className='h-12 w-12 overflow-hidden rounded-md border bg-muted'>
                                                {product.assets[0] ? (
                                                    <Image
                                                        src={product.assets[0].url}
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
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell className='py-3 px-4 text-foreground'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>
                                                    Rs. {product.minPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell className='py-3 px-4'>
                                            <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                                                {product.category.name}
                                            </span>
                                        </TableCell>

                                        {/* Sub Category */}
                                        <TableCell className='py-3 px-4'>
                                            <span className='inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground'>
                                                {product.subCategory.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className='py-3 px-4'>
                                            <Switch
                                                checked={product.isPublished}
                                                onCheckedChange={(val) =>
                                                    onPublishStatusChange(product.id, val)
                                                }
                                            />
                                        </TableCell>
                                        {/* Actions */}
                                        <TableCell className='py-3 px-4'>
                                            <div className='flex justify-end gap-2'>
                                                <EditProduct refetch={refetch} product={product} />
                                                <ConfirmationBox
                                                    trigger={
                                                        <div className='hover:text-destructive hover:bg-red-200 cursor-pointer bg-red-100 p-2 border-0 rounded-sm'>
                                                            <Trash2 size={16} />
                                                        </div>
                                                    }
                                                    title='Delete Product'
                                                    description='Are you sure you want to delete the product?'
                                                    onRevoke={() => handleDeleteProduct(product.id)}
                                                    revokeButtonText='Delete'
                                                    cancelButtonText='Cancel'
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Pagination
                        total={totalEntries}
                        pageSize={pageSize}
                        page={currPage}
                        setPage={setCurrPage}
                    />
                </>
            )}
        </div>
    );
}
