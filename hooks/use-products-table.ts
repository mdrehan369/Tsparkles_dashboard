import { deleteProduct, markProductPublished } from '@/actions/products';
import { productKeys } from '@/constants/querykeys';
import { fetchAllProducts } from '@/queries/product';
import { FullProduct } from '@/types/product.types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useDebounce from './use-debounce';

const pageSize = 10;

export default function useProductsTable() {
    const [currPage, setCurrPage] = useState(1);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query);
    const {
        data,
        isPending: loading,
        isFetching,
        refetch,
    } = useQuery<{ products: FullProduct[]; count: number }>({
        initialData: { products: [], count: 0 },
        queryKey: [...productKeys.GET_ALL_PRODUCTS, currPage, debouncedQuery],
        queryFn: () => fetchAllProducts(currPage, pageSize, debouncedQuery),
    });

    const products = data.products;
    const totalEntries = data.count;

    const handleDeleteProduct = async (id: FullProduct['id']) => {
        //TODO: Add debounce in deleting product
        toast.loading('Deleting product..');
        const results = await deleteProduct(id);
        toast.dismissAll();
        if (results instanceof Error) toast.error(results.message);
        else toast.success('Product deleted successfully');
        refetch();
    };

    const onPublishStatusChange = async (productId: FullProduct['id'], val: boolean) => {
        await markProductPublished(productId, val);
        refetch();
    };

    return {
        products,
        totalEntries,
        handleDeleteProduct,
        onPublishStatusChange,
        currPage,
        setCurrPage,
        loading,
        refetch,
        pageSize,
        query,
        setQuery,
        isFetching,
    };
}
