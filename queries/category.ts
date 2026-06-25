import apiClient from '@/config/axiosConfig';
import { AssetType } from '@/lib/generated/prisma/enums';

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

export async function addCategory(payload: {
    name: string;
    backgroundColor: string;
    image?: { url: string; fileId: string; type: AssetType };
}) {
    const response = await apiClient.post('/categories', payload);
    return response;
}

export async function deleteCategory(categoryName: string) {
    const response = await apiClient.delete('/categories', { data: { name: categoryName } });
    return response;
}
