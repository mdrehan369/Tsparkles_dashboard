'use server';
import { Asset, Product } from '@/prisma/generated/prisma/client';
import {
    createProduct,
    deleteAssetFromProductRepo,
    deleteProductById,
    getProductById,
    updateProductPublicationStatusRepo,
    updateProductRepo,
} from '@/repositories/product';
import { AddProductParams } from '@/types/product.types';
import { generateRandomString } from '@/utils/helpers';
import deleteAsset from './assetManagement';

export const addProduct = async (data: AddProductParams) => {
    try {
        const slug = generateRandomString(12);
        const newProduct = await createProduct({ ...data, slug });
        return newProduct;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
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
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
};

export const updateProduct = async (productId: Product['id'], updateData: AddProductParams) => {
    try {
        const product = await getProductById(productId);
        if (!product) throw new Error('Product not found');
        const updatedProduct = await updateProductRepo(productId, updateData);
        return updatedProduct;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
};

export const deleteProductAsset = async (productId: Product['id'], fileId: Asset['fileId']) => {
    try {
        const product = await getProductById(productId);
        if (!product) throw new Error('Product not found');
        const updatedProduct = await deleteAssetFromProductRepo(productId, fileId);
        return updatedProduct;
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
};

export const markProductPublished = async (productId: Product['id'], status: boolean) => {
    try {
        const product = await getProductById(productId);
        if (!product) throw new Error('Product not found');
        await updateProductPublicationStatusRepo(productId, status);
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
};
