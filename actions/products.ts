'use server';
import { createProduct } from '@/repositories/product';
import { AddProductParams } from '@/types/product.types';
import { generateRandomString } from '@/utils/helpers';

export const addProduct = async (data: AddProductParams) => {
    try {
        const slug = generateRandomString(12);
        const newProduct = await createProduct({ ...data, slug });
        return newProduct;
    } catch (e) {
        console.log(e);
        return null;
    }
};
