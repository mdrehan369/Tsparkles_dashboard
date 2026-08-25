import apiClient from '@/config/axiosConfig';

export async function fetchAllProducts(page: number = 1, limit: number = 5, search: string = '') {
    try {
        const response = await apiClient.get(
            `/products?page=${page}&limit=${limit}&search=${search}`
        );
        return response.data.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}
