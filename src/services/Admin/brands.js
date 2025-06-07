
import apiClient from '../axios'; // Import instance Axios đã cấu hình

export default {
  getBrandsList() {
    return apiClient.get('/brands');

    // Endpoint bạn cung cấp localhost:3000/brands
  },
 createBrand(brandData) {
  return apiClient.post('/brands', brandData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
},
  updateBrand(id, brandData) {
      return apiClient.put(`/brands/${id}`, brandData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
}