import apiClient from '@/config/axiosConfig';
import { Category } from '@/prisma/generated/prisma/client';

export async function addSubcategory(categoryId: Category['id'], name: string) {
    const response = await apiClient.post('/sub-categories', { categoryId, name });
    return response;
}
