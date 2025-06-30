<template>
  <v-container fluid fill-height class="login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg">
          <v-card-title class="text-center text-h5 py-4">
            🔐 Đăng nhập Admin
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="formData.email"
                label="Email"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                type="email"
                required
                variant="outlined"
              />

              <v-text-field
                v-model="formData.password"
                label="Mật khẩu"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="toggleShowPassword"
                required
                variant="outlined"
              />
            </v-form>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-btn
              block
              color="primary"
              @click="handleLogin"
              :loading="loading"
              :disabled="loading"
            >
              Đăng nhập
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '@/services/auth/auth.service'
import { saveAdminSession } from '@/store/authAdmin'

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const showPassword = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const formRef = ref(null)
const router = useRouter()

const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email không hợp lệ'
]

const passwordRules = [
  v => !!v || 'Mật khẩu là bắt buộc',
  v => v.length >= 4 || 'Ít nhất 4 ký tự'
]

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

const handleLogin = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  loading.value = true

  try {
    const res = await adminLogin(formData.value.email, formData.value.password)

    if (res.status === 'true') {
      // Dùng hàm trong store để lưu token + user
      saveAdminSession(res.token, res.data)

      showSnackbar(res.message, 'success')
      router.push('/admin/dashboard')
    } else {
      showSnackbar(res.message || 'Sai tài khoản hoặc mật khẩu', 'error')
    }
  } catch (err) {
    showSnackbar(err.message || 'Sai tài khoản hoặc mật khẩu', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(to right, #141e30, #243b55);
  min-height: 100vh;
  padding-top: 60px;
}

.v-card {
  border-radius: 12px;
}
</style>
