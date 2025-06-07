import axios from 'axios';

// Tạo một instance Axios với cấu hình tùy chỉnh
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Lấy từ biến môi trường
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;