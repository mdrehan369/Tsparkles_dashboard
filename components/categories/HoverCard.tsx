import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Info } from 'lucide-react';
import { CategoryWithSubCategory } from '@/types/category.types';

function SubCategoryHoverCard({ category }: { category: CategoryWithSubCategory }) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <div className='flex gap-2'>
                    <Button
                        size='sm'
                        className='hover:bg-gray-200 hover:text-gray-600 cursor-pointer'
                        variant='outline'
                    >
                        <Info size={14} />
                    </Button>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className='text-sm text-gray-600'>
                {category.SubCategory.length == 0 ? (
                    <div className='text-center'>No Subcategories Added Yet</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Sub Category</TableCell>
                                <TableCell>Products</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {category.SubCategory.map(({ id, name, Product }) => (
                                <TableRow key={id}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell>{Product.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </HoverCardContent>
        </HoverCard>
    );
}

export default SubCategoryHoverCard;
