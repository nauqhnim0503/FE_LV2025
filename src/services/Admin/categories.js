import apiClient from '../axios'; // Import instance Axios đã cấu hình

export default {
  getCategoriesList() {
    return apiClient.get('/categories');

    // Endpoint bạn cung cấp localhost:3000/categories
  },
  createCategories(categoriesData) {
    return apiClient.post('/categories', categoriesData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCategories(id, categoriesData) {
      return apiClient.put(`/categories/${id}`, categoriesData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
}