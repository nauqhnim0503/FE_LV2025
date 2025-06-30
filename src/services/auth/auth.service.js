import axios from 'axios'

//login admin
const API_URL = 'http://localhost:3000/auth'
export async function adminLogin(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/auth/adminlogin', { email, password })
    return response.data
  } catch (error) {
    console.error('API adminLogin lỗi:', error)
    throw error.response?.data || new Error('Lỗi kết nối server')
  }
}

//login user
export async function registerUser({ name, email, password }) {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  return data;
}
export async function loginUser({ email, password }) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  let errorMessage = 'Email hoặc mật khẩu không đúng'

  if (!response.ok) {
    // Cố gắng parse JSON nếu có nội dung trả về
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch (err) {
      // Không parse được cũng không sao, giữ errorMessage mặc định
    }

    throw new Error(errorMessage)
  }

  // Thành công
  const data = await response.json()
  return data
}