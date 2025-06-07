
import apiClient from '../axios'; // Import instance Axios đã cấu hình

export default {
  getColorsList() {
    return apiClient.get('/colors');

    // Endpoint bạn cung cấp localhost:3000/colors
  },
 createColors(colorsData) {
  return apiClient.post('/colors', colorsData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
},
updateColors(id, colorsData) {
      return apiClient.put(`/colors/${id}`, colorsData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
}