<template>
  <v-app>
    <!-- Loading bar -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      absolute
      top
    ></v-progress-linear>

    <v-main class="page-container">
      <v-overlay
        :model-value="loading"
        persistent
        class="d-flex justify-center align-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-overlay>
      <router-view :key="$route.fullPath" />
      <ChatBot />
    </v-main>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import ChatBot from '@/views/ChatBot.vue'
const { snackbar } = useSnackbar()
const router = useRouter()
const loading = ref(false)
router.beforeEach((to, from, next) => {
  loading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    loading.value = false
  }, 400) // delay nhẹ cho mượt
})
</script>
<style>
.page-container {
  position: relative;
  min-height: 100vh;
}

</style>