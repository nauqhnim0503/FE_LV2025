<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="panel-header">
        <router-link to="/login" class="link active-link">Đăng nhập</router-link>
        <router-link to="/register" class="link">Đăng ký</router-link>
      </div>

      <form @submit.prevent="login">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        
        <input id="username" v-model="username" type="text" placeholder="Nhập tên..." />

        
        <div class="password-field">
          <input
            id="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            placeholder="Nhập mật khẩu..."/>
          <v-icon
            class="eye-icon"
            @click="isPasswordVisible = !isPasswordVisible"
            color="grey darken-1"
            size="20">
            {{ isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </div>

        <router-link to="/forgot-password" class="forgot">Quên mật khẩu?</router-link>
        <button type="submit" class="login-btn">Đăng nhập <span>&rarr;</span></button>
      </form>

      <div class="divider">
        <span>Hoặc</span>
      </div>

      <div id="google-signin" class="social-login"></div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { saveUserSession } from '@/store/auth'
import { loginUser } from '@/services/auth/auth.service'
import axios from 'axios'

const isPasswordVisible = ref(false)

const username = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()
const errorMessage = ref('')

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: '672590852123-a30l6u2g28e5a85edq87nbb8cdkm8l4s.apps.googleusercontent.com',
    callback: handleCredentialResponse,
  })

  window.google.accounts.id.renderButton(
    document.getElementById('google-signin'),
    {
      theme: 'outline',
      size: 'large',
      width: '100%',
    }
  )
})
async function handleCredentialResponse(response) {
  try {
    const res = await axios.post('http://localhost:3000/auth/google/callback', {
      token: response.credential
    })

    const { token, data: user } = res.data
    saveUserSession(token, user)
    router.push('/')
  } catch (err) {
    console.error('Google login failed:', err)
    alert('Đăng nhập Google thất bại!')
  }
}
async function login() {
  if (!username.value || !password.value) {
  errorMessage.value = 'Vui lòng nhập đầy đủ thông tin'
  return
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
  if (!emailRegex.test(username.value)) {
    errorMessage.value = 'Tài khoản phải là địa chỉ Gmail hợp lệ'
    return
  }

  try {
    const response = await loginUser({
      email: username.value,
      password: password.value
    })

    if (!response || !response.token || !response.data) {
      throw new Error('Tài khoản hoặc mật khẩu không đúng')
    }

    const { token, data: user } = response
    saveUserSession(token, user)

    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (err) {
    console.error('Lỗi đăng nhập:', err)
    errorMessage.value = err.message || 'Đăng nhập thất bại'
  }
}
</script>


<style scoped>
.login-container {
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

.login-panel {
  width: 400px;
  min-height: 560px; /* giữ chiều cao tối thiểu đủ chứa trang dài nhất */
  background: white;
  color: black;
  padding: 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
}

.link {
  color: black;
  text-decoration: none;
  opacity: 0.6;
  transition: all 0.3s ease;
  position: relative;
}

.link:hover {
  opacity: 1;
}

.active-link {
  opacity: 1;
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
  transition: all 0.3s;
}

input {
  width: 100%;
  padding: 15px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: black;
  outline: none;
  transition: border-color 0.3s;
  margin: 10px 0 10px;
}

input::placeholder {
  color: #c6c6c6;
}

/* Hiệu ứng khi focus vào input */
input:focus {
  border-bottom: 2px solid #D37171;
}

.forgot {
  text-decoration: none;
  display: block;
  text-align: right;
  font-size: 13px;
  margin-bottom: 15px;
  color: #666;
  cursor: pointer;
}

.login-btn {
  width: 200px;           /* hoặc 50% nếu bạn muốn linh hoạt */
  padding:6px 10px;
  border: none;
  border-radius: 30px;
  background-color: #D37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;          /* căn giữa nút */
  display: block;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ccc;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-login {
  text-align: center;
}

.social-icon {
  font-size: 28px;
  background: #D37171;
  color: white;
  padding: 8px 16px;
  border-radius: 50%;
  cursor: pointer;
}
.error-message {
  color: #d9534f;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}
.password-field {
  position: relative;
}

.password-field input {
  width: 100%;
  padding: 15px 35px 15px 0; /* chừa chỗ cho icon bên phải */
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: black;
  outline: none;
  transition: border-color 0.3s;
  margin: 10px 0;
}

.password-field input::placeholder {
  color: #c6c6c6;
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
