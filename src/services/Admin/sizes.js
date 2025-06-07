
import apiClient from '../axios'; // Import instance Axios đã cấu hình
export default {
  getSizesList() {
    return apiClient.get('/sizes');
  },
  createSizes(data) {
    return apiClient.post('/sizes', data);
  },
  updateSizes(id, data) {
    return apiClient.put(`/sizes/${id}`, data);
  }
}