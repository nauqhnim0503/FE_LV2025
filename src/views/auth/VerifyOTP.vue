<template>
  <div class="verify-otp-container">
    <div class="otp-panel">
      <div class="back-button" @click="goBack" style="cursor:pointer">
        <v-icon size="24" color="black">mdi-arrow-left</v-icon>
        <span>Trở lại</span>
      </div>

      <h2 class="title">Xác thực mã OTP</h2>

      <p class="subtitle">
        Nhập mã xác thực đã được gửi đến email của bạn:
        <span class="email-highlight">{{ email }}</span>
      </p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="otp-inputs">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          maxlength="1"
          type="text"
          class="otp-box"
          @input="handleInput(index)"
          @keydown="handleKeyDown($event, index)"
          @paste="handlePaste"
          @focus="$event.target.select()"/>
      </div>

      <div class="resend-container">
        <span>Không nhận được mã? </span>
        <span
          class="resend-link"
          :class="{ disabled: countdown > 0 }"
          @click="resendOTP">
          Gửi lại{{ countdown > 0 ? ` (${countdown}s)` : '' }}
        </span>
      </div>

      <button
        class="verify-btn"
        :disabled="!isOtpComplete || loading"
        @click="verifyOTP">
        {{ loading ? 'Đang xác thực...' : 'Xác nhận' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const email = route.query.email || ''
const otpDigits = ref(['', '', '', '', '', ''])
const countdown = ref(60)
const loading = ref(false)
const errorMessage = ref('')
let timer = null

const isOtpComplete = computed(() =>
  otpDigits.value.every((d) => d !== '' && /^\d$/.test(d))
)

const goBack = () => {
  router.push('/forgot-password')
}

const handleInput = (index) => {
  otpDigits.value[index] = otpDigits.value[index].replace(/\D/g, '')
  if (otpDigits.value[index] && index < 5) {
    const next = document.querySelectorAll('.otp-box')[index + 1]
    next?.focus()
  }
}

const handleKeyDown = (event, index) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = ''
    const prev = document.querySelectorAll('.otp-box')[index - 1]
    prev?.focus()
  }
}

const handlePaste = (event) => {
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
  otpDigits.value = [...pasted.slice(0, 6).split(''), '', '', '', '', ''].slice(0, 6)
}

const verifyOTP = async () => {
  if (!isOtpComplete.value) return
  loading.value = true
  errorMessage.value = ''

  try {
    const otp = otpDigits.value.join('')
    await axios.post('http://localhost:3000/auth/verify-otp', {
      email,
      otp
    })

    router.push({
      name: 'ResetPassword',
      query: { email: email, otp: otp } 
    })
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Mã xác thực không đúng hoặc đã hết hạn'
    otpDigits.value = ['', '', '', '', '', '']
    document.querySelectorAll('.otp-box')[0]?.focus()
  } finally {
    loading.value = false
  }
}


const resendOTP = async () => {
  if (countdown.value > 0) return
  loading.value = true
  errorMessage.value = ''
  try {
    await axios.post('http://localhost:3000/auth/forgot-password', { email })
    startCountdown()
  } catch {
    errorMessage.value = 'Không thể gửi lại mã. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

startCountdown()

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.verify-otp-container {
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

.otp-panel {
  width: 400px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: black;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}

.email-highlight {
  font-weight: 600;
  color: #d37171;
}

.otp-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.otp-box {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 22px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.otp-box:focus {
  border-color: #d37171;
}

.resend-container {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.resend-link {
  color: #d37171;
  font-weight: 500;
  cursor: pointer;
  margin-left: 5px;
}

.resend-link.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.verify-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 30px;
  background-color: #d37171;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
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
  margin-bottom: 10px;
}
</style>
