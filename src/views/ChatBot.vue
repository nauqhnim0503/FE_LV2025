<template>
  <div v-if="shouldShowBot">
    <df-messenger
      intent="WELCOME"
      chat-title="Fashion"
      agent-id="aa481c2d-f2eb-40fe-93f8-3c4b8dab2053"
      language-code="vi"
    ></df-messenger>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'

const route = useRoute()

const shouldShowBot = computed(() => {
  const hiddenPaths = ['/checkout', '/login', '/register','/forgot-password', '/reset-password','/verify-OTP']
  return !hiddenPaths.includes(route.path) && !route.path.startsWith('/admin')
})

onMounted(() => {
  const existing = document.querySelector('script[src*="dialogflow"]')
  if (!existing) {
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
df-messenger {
  position: fixed;
  right: 20px;
  bottom: 5px;
  z-index: 9999;
  transform: translateX(-40px); 
}
</style>
