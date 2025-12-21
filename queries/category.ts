import apiClient from '@/config/axiosConfig';

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

export async function addCategory(categoryName: string) {
  try {
    const response = await apiClient.post(
      '/categories',
      { name: categoryName }
    )
    return response.status < 400
  } catch (e) {
    console.log(e)
    return false
  }
}


export async function deleteCategory(categoryName: string) {
  try {
    const response = await apiClient.delete(
      '/categories',
      { data: { name: categoryName } }
    )
    return response.status < 400
  } catch (e) {
    console.log(e)
    return false
  }
}
