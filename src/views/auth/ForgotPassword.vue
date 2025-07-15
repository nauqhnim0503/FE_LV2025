<template>
  <div class="forgot-password-container">
    <div class="forgot-panel">
        <div class="back-button" @click="goBack" style="cursor:pointer">
          <v-icon size="24" color="black">mdi-arrow-left</v-icon>
          <span>Trở lại</span>
        </div>
      <h2 class="title">Quên mật khẩu</h2>

      <form @submit.prevent="sendVerificationCode">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <input
          v-model="email"
          type="email"
          placeholder="Nhập email của bạn"
        />

        <button type="submit" class="send-btn">
          Gửi mã xác thực <span>&rarr;</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const goBack = () => {
  router.push('/login')
}

const sendVerificationCode = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
  if (!email.value) {
    errorMessage.value = 'Vui lòng nhập email'
    return
  }

  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Email không hợp lệ (phải là Gmail)'
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/auth/forgot-password', { email: email.value })
    successMessage.value = response.data.message
    // Chuyển trang
    router.push({ name: 'verifyOTP', query: { email: email.value } })
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Không thể gửi mã. Vui lòng thử lại.'
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url('https://theme.hstatic.net/1000197303/1001046599/14/login-bg.jpg?v=16282');
  background-size: cover;
  background-position: center;
  font-family: 'Poppins', sans-serif;
}

.forgot-panel {
  width: 400px;
  background: white;
  color: black;
  padding: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 15px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: black;
  outline: none;
  margin-bottom: 20px;
  transition: border-color 0.3s;
}

input::placeholder {
  color: #bbb;
}

input:focus {
  border-bottom: 2px solid #D37171;
}

.send-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 30px;
  background-color: #D37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.error-message {
  color: #d9534f;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.success-message {
  color: #28a745;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
