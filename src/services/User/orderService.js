import axios from 'axios';

const API_URL = 'http://localhost:3000'; // đổi theo backend bạn đang chạy

// Hàm gửi request tạo order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        // nếu cần token thì thêm Authorization ở đây, ví dụ:
         'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Ném lỗi lên để component gọi xử lý
    throw error.response ? error.response.data : error;
  }
};
