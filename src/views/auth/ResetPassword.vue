<template>
  <div class="reset-password-container">
    <div class="reset-panel">
      <div class="back-button" @click="goBack" style="cursor:pointer">
        <v-icon size="24" color="black">mdi-arrow-left</v-icon>
        <span>Trở lại</span>
      </div>

      <h2 class="title">Đặt lại mật khẩu</h2>

      <form @submit.prevent="submitReset">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Mật khẩu mới" />
          <v-icon
            class="eye-icon"
            @click="showPassword = !showPassword"
            color="grey darken-1"
            size="20">
            {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </div>
      
        <!-- Xác nhận mật khẩu -->
        <div class="password-field">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Xác nhận mật khẩu" />
          <v-icon
            class="eye-icon"
            @click="showConfirm = !showConfirm"
            color="grey darken-1"
            size="20">
            {{ showConfirm ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </div>

        <button type="submit" class="send-btn">
          Đặt lại mật khẩu <span>&rarr;</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from '@/composables/useSnackbar'

const { snackbar, success, error, hideSnackbar } = useSnackbar()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)
const showConfirm = ref(false)

const email = route.query.email
const otp = route.query.otp
console.log('Email from query:', email);
console.log('OTP from query:', otp);
// if (!email || !otp) {
//   router.push('/forgot-password')
// }

const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const goBack = () => {
  router.push('/login')
}
const submitReset = async () => {
  errorMessage.value = ''
  console.log('Sending reset request with:', { email, otp, password: password.value })

  if (!password.value || !confirmPassword.value) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  try {
    await axios.post('http://localhost:3000/auth/reset-password', {
      email,
      otp,
      password: password.value
    })
    success('Đặt lại mật khẩu thành công!')
    setTimeout(() => {
      hideSnackbar()
      router.push('/login')
    }, 2000)
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || 'Đặt lại mật khẩu thất bại'
      error('Đặt lại mật khẩu thất bại')
      console.error('Reset password error:', err)
  }
}
</script>

<style scoped>
.reset-password-container {
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

.reset-panel {
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

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 15px;
  font-size: 14px;
}
.password-field {
  position: relative;
  margin-bottom: 20px;
}

.password-field input {
  width: 100%;
  padding: 15px 35px 15px 0; /* chừa chỗ icon */
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: black;
  outline: none;
  transition: border-color 0.3s;
}

.password-field input:focus {
  border-bottom: 2px solid #D37171;
}

.eye-icon {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

</style>
