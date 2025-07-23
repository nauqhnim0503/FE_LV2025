<template>
  <v-container>
    <v-card class="pa-4 mb-4" elevation="3">
      <v-card-title>Cập nhật Reels sản phẩm</v-card-title>
    </v-card>
    <v-card class="pa-4" elevation="3">
        <v-card-text v-if="oldVideoUrl" class="mb-4">
  <div>Video hiện tại:</div>
  <video width="240" controls :src="oldVideoUrl" style="border-radius:6px; background:#000;"></video>
</v-card-text>
      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-text-field
          v-model="title"
          label="Tiêu đề"
          :error="!!titleError"
          :error-messages="titleError"
          required
          variant="outlined"
        />

        <v-select
          v-model="product_id"
          :items="products"
          item-title="name"
          item-value="id"
          label="Chọn sản phẩm"
          variant="outlined"
          required
        />

        <v-file-input
          v-model="videoFile"
          label="Chọn video mới (nếu muốn thay)"
          accept="video/*"
          prepend-inner-icon="mdi-video"
          prepend-icon=""
          show-size
          variant="outlined"
        />

        <v-btn type="submit" color="primary" class="mt-4 me-4">Cập nhật</v-btn>
        <v-btn text class="mt-4" @click="cancel">Hủy</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar' 

const { success, error } = useSnackbar()
const router = useRouter()
const route = useRoute()

const title = ref('')
const product_id = ref(null)
const videoFile = ref(null)
const products = ref([])
const formRef = ref(null)
const oldVideoUrl = ref('')
const existingReels = ref([])
const titleError = ref('')
// Lấy id reel từ params
const reelId = route.params.id

const fetchProducts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data.data
  } catch (err) {
    console.error('Lỗi lấy sản phẩm:', err)
  }
}
const validateReel = () => {
  const titleExists = existingReels.value.some(r => r.title.trim().toLowerCase() === title.value.trim().toLowerCase())
  if (titleExists) {
    error('❌ Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác.')
    return false
  }
  return true
}

const fetchReelDetail = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/reels/${reelId}`)
    const reel = res.data
    title.value = reel.title
    product_id.value = reel.product_id
    if (reel.video_url) {
      oldVideoUrl.value = `http://localhost:3000/${reel.video_url}`
    }
  } catch (err) {
    console.error('Lỗi lấy thông tin reel:', err)
  }
}

const submitForm = async () => {
  if (!formRef.value.validate()) return
  if (!validateReel()) return

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('product_id', product_id.value)
    if (videoFile.value) {
      formData.append('video', videoFile.value)
    }

    await axios.put(`http://localhost:3000/api/reels/${reelId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    success('✏️ Cập nhật thành công!')
    router.push('/admin/reels')
  } catch (err) {
    console.error('Lỗi cập nhật reel:', err)
    error('❌ Cập nhật thất bại!')
  }
}

const cancel = () => {
  router.back()
}
watch(title, (newVal) => {
  if (!newVal) {
    titleError.value = 'Tiêu đề không được để trống'
    return
  }

  const exists = existingReels.value.some(
    (r) => r.title.trim().toLowerCase() === newVal.trim().toLowerCase()
  )

  titleError.value = exists ? 'Tiêu đề đã tồn tại' : ''
})
onMounted(() => {
  fetchProducts()
  fetchReelDetail()
})

</script>
