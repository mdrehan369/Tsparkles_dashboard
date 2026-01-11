'use server';
import { Product } from '@/prisma/generated/prisma/client';
import { createProduct, deleteProductById, getProductById } from '@/repositories/product';
import { AddProductParams } from '@/types/product.types';
import { generateRandomString } from '@/utils/helpers';
import deleteAsset from './assetManagement';

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

export const deleteProduct = async (productId: Product['id']) => {
    try {
        const product = await getProductById(productId);
        if (!product) throw new Error('No product found!');

        for (let asset of product.Asset) await deleteAsset(asset.fileId);

        const deletedProduct = await deleteProductById(productId);
        if (!deletedProduct) throw new Error('Some error occured while deleting product');

        return deletedProduct;
    } catch (e) {
        console.log(e);
        return e;
    }
};
