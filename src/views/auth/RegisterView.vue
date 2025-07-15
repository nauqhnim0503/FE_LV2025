<template>
  <div class="register-container">
    <div class="register-panel">
      <div class="panel-header">
        <router-link to="/login" class="link">Đăng nhập</router-link>
        <router-link to="/register" class="link active-link">Đăng ký</router-link>
      </div>

      <form @submit.prevent="register">
        <input
          v-model.trim="name"
          type="text"
          placeholder="Họ và tên"
          :class="{ error: errors.name }"
        />
        <small v-if="errors.name" class="error-text">{{ errors.name }}</small>

        <input
          v-model.trim="username"
          type="text"
          placeholder="Tên đăng nhập"
          :class="{ error: errors.username }"
        />
        <small v-if="errors.username" class="error-text">{{ errors.username }}</small>

        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu"
          :class="{ error: errors.password }"
        />
        <small v-if="errors.password" class="error-text">{{ errors.password }}</small>

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          :class="{ error: errors.confirmPassword }"
        />
        <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>

        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }} <span>&rarr;</span>
        </button>

        <div v-if="serverError" class="server-error">{{ serverError }}</div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/auth/auth.service'  
import { useSnackbar } from '@/composables/useSnackbar'

const{showSnackbar} = useSnackbar()
const router = useRouter()

const name = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const errors = ref({})
const serverError = ref('')
const loading = ref(false)

function validate() {
  errors.value = {}
  let valid = true

  if (!name.value) {
    errors.value.name = 'Họ và tên là bắt buộc.'
    valid = false
  }

  if (!username.value) {
    errors.value.username = 'Tên đăng nhập là bắt buộc.'
    valid = false
  } else if (!/.+@.+\..+/.test(username.value)) {
    errors.value.username = 'Email không hợp lệ.'
    valid = false
  }

  if (!password.value) {
    errors.value.password = 'Mật khẩu là bắt buộc.'
    valid = false
  } else if (password.value.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự.'
    valid = false
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    valid = false
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    valid = false
  }

  return valid
}

async function register() {
  serverError.value = ''
  if (!validate()) return

  loading.value = true

  try {
    const data = await registerUser({
      name: name.value,
      email: username.value,
      password: password.value,
    })

    if (data.status === 'true') {
      showSnackbar(data.message || 'Đăng ký thành công!','success')
      router.push('/login')
    } else {
      // Xử lý lỗi trùng email
      if (data.message === 'Email đã tồn tại') {
        errors.value.username = data.message
      } else {
        serverError.value = data.message || 'Đăng ký thất bại.'
      }
    }
  } catch (error) {
    serverError.value = error.message || 'Lỗi mạng hoặc máy chủ.'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
/* Giữ nguyên CSS của bạn */
.register-container {
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

.register-panel {
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
  margin: 10px 0;
}

input::placeholder {
  color: #c6c6c6;
}

input:focus {
  border-bottom: 2px solid #D37171;
}

.register-btn {
  width: 200px;
  padding: 6px 10px;
  border: none;
  border-radius: 30px;
  background-color: #D37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
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

/* Styles cho lỗi */
.error {
  border-bottom: 2px solid #D37171 !important;
}

.error-text {
  color: #D37171;
  font-size: 12px;
  margin: -8px 0 10px 0;
  display: block;
}

.server-error {
  margin-top: 15px;
  color: #D37171;
  font-weight: 600;
  text-align: center;
}
</style>
