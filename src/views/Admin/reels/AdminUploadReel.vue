<template>
  <v-container>
    <v-card class="pa-4" elevation="3">
      <v-card-title>🎬 Upload Reels sản phẩm</v-card-title>

      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-text-field
          v-model="title"
          label="Tiêu đề"
          :error="!!titleError"
          :error-messages="titleError"
          required
          variant="outlined"/>

        <v-select
          v-model="product_id"
          :items="products"
          item-title="name"
          item-value="id"
          label="Chọn sản phẩm"
          variant="outlined"
          required/>

        <v-file-input
          v-model="videoFile"
          label="Chọn video"
          accept="video/*"
          prepend-icon=""
          prepend-inner-icon="mdi-video"
          show-size
          variant="outlined"
          required/>

        <v-btn type="submit" color="primary" class="mt-4">Tải lên</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar' 

const { success, error } = useSnackbar()
const router = useRouter()
const title = ref('')
const product_id = ref(null)
const videoFile = ref(null)
const products = ref([])
const existingReels = ref([])
const titleError = ref('')
const formRef = ref(null)

const fetchProducts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data.data
  } catch (err) {
    console.error('Lỗi lấy sản phẩm:', err)
  }
}

const fetchExistingReels = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/reels')
    existingReels.value = res.data
  } catch (err) {
    console.error('Lỗi lấy danh sách reels:', err)
  }
}

// Kiểm tra tiêu đề trùng
const validateTitle = () => {
  if (!title.value.trim()) {
    titleError.value = 'Tiêu đề không được để trống'
    return false
  }
  const exists = existingReels.value.some(
    r => r.title.trim().toLowerCase() === title.value.trim().toLowerCase()
  )
  if (exists) {
    titleError.value = 'Tiêu đề đã tồn tại'
    return false
  }
  titleError.value = ''
  return true
}

watch(title, () => {
  validateTitle()
})

const submitForm = async () => {
  if (!formRef.value.validate()) return

  // Kiểm tra validate tiêu đề trước khi submit
  if (!validateTitle()) return

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('product_id', product_id.value)
  formData.append('video', videoFile.value)

  try {
    await axios.post('http://localhost:3000/api/reels/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    success('🎉 Upload thành công!')

    title.value = ''
    product_id.value = null
    videoFile.value = null
    router.push('/admin/reels')
  } catch (err) {
    console.error(err)
    error('❌ Upload thất bại!')
  }
}

onMounted(() => {
  fetchProducts()
  fetchExistingReels()
})

</script>
