
import adminAxios from '../adminAxios'

export default {
  getBrandsList() {
    return adminAxios.get('/brands');

    // Endpoint bạn cung cấp localhost:3000/brands
  },
 createBrand(brandData) {
  return adminAxios.post('/brands', brandData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
},
  updateBrand(id, brandData) {
      return adminAxios.put(`/brands/${id}`, brandData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
}