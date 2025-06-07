import apiClient from '../axios';
import axios from 'axios';

export default {
  getProductsList() {
    return apiClient.get('/products');
  },
  createProducts(formData) {
    return apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct(id, formData) {
    return apiClient.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getProductById(id) {
    return apiClient.get(`/products/${id}`);
  }
}
