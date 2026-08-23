import apiClient from '@/config/axiosConfig';
import { Category } from '@/lib/generated/prisma/client';
import { UpdateCategorySchemaType } from '@/zod/category';

export async function fetchAllCategories(page: number, limit: number, search: string) {
    try {
        const categories = await apiClient.get(
            `/categories?page=${page}&limit=${limit}&search=${search}`
        );
        return categories.data.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function addCategory(payload: { name: string }) {
    const response = await apiClient.post('/categories', payload);
    return response;
}

export async function deleteCategory(categoryName: string) {
    const response = await apiClient.delete('/categories', { data: { name: categoryName } });
    return response;
}

export async function updateCategory(id: Category['id'], payload: UpdateCategorySchemaType) {
    const response = await apiClient.patch(`/categories/${id}`, payload);
    return response;
}
