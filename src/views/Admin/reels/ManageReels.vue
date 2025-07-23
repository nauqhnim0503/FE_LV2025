<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
          <v-card class="pa-4 mb-4" elevation="3">
            <v-row align="center" justify="space-between">
              <v-col cols="auto">
                <v-card-title class="text-h5 font-weight-bold">
                  Quản lý Reels
                </v-card-title>
              </v-col>
          
              <v-col cols="auto">
                <v-btn color="primary" :to="{ name: 'uploadReels' }">
                  <v-icon start>mdi-plus</v-icon>
                  Thêm Reels
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>


      <v-col cols="12">
        <v-card class="pa-4">
          <v-text-field
            v-model="search"
            label="Tìm kiếm theo tiêu đề hoặc sản phẩm"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mb-4"
          />

          <v-data-table
            :headers="headers"
            :items="filteredReels"
            :items-per-page="10"
            class="elevation-1"
          >
            <template #item.stt="{ index }">
              {{ index + 1 }}
            </template>

            <template #item.title="{ item }">
              {{ item.title }}
            </template>

            <template #item.productName="{ item }">
              {{ item.productName || '—' }}
            </template>

            <template #item.video_url="{ item }">
              <video width="120" controls :src="videoBaseUrl + item.video_url"></video>
            </template>

            <template #item.created_at="{ item }">
              {{ formatDate(item.created_at) }}
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex justify-center gap-2">
                <v-tooltip text="Chỉnh sửa" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="primary"
                      :to="{ name: 'updateReels', params: { id: item.id } }"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Xóa màu sắc" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="error"
                      @click="confirmDelete(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template #no-data>
              <v-alert type="info" border="start" text>
                Không tìm thấy reels phù hợp với từ khóa "{{ search }}"
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog sửa reel -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>Chỉnh sửa Reel</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editReel.title"
              label="Tiêu đề"
              required
              variant="outlined"
            />
            <v-select
              v-model="editReel.product_id"
              :items="products"
              item-title="name"
              item-value="id"
              label="Chọn sản phẩm"
              required
              variant="outlined"/>    
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">Hủy</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="updateReel">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog xác nhận xóa -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Xác nhận xóa reel</v-card-title>
        <v-card-text>
          Bạn có chắc muốn xóa reel "<strong>{{ deleteReel.title }}</strong>" không?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Hủy</v-btn>
          <v-btn color="red" @click="deleteReelConfirmed">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const search = ref('')
const reels = ref([])
const products = ref([])

const editDialog = ref(false)
const deleteDialog = ref(false)

const editReel = ref({
  id: null,
  title: '',
  product_id: null,
  description: ''
})

const deleteReel = ref({
  id: null,
  title: ''
})

const valid = ref(false)
const editFormRef = ref(null)

const videoBaseUrl = 'http://localhost:3000/' // sửa theo backend bạn nếu cần

const headers = [
  { title: 'STT', key: 'stt', align: 'left', width: 50 },
  { title: 'Tiêu đề', key: 'title', align: 'left',width:300 },
  { title: 'Sản phẩm', key: 'productName', align: 'left',width:150 },
  { title: 'Video', key: 'video_url', align: 'center', width: 500 },
  { title: 'Ngày tạo', key: 'created_at', align: 'left', width: 200 },
  { title: 'Thao tác', key: 'actions', align: 'center', width: 120 }
]

onMounted(() => {
  fetchReels()
  fetchProducts()
})

async function fetchReels() {
  try {
    const res = await axios.get('http://localhost:3000/api/reels')
    reels.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách reels:', err)
  }
}

async function fetchProducts() {
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err)
  }
}

const filteredReels = computed(() => {
  const key = search.value.toLowerCase().trim()
  
  // Map reels với productName từ products
  const reelsWithProductName = reels.value.map(reel => {
    const product = products.value.find(p => p.id === reel.product_id)
    return {
      ...reel,
      productName: product ? product.name : '—'
    }
  })

  if (!key) return reelsWithProductName

  return reelsWithProductName.filter(r => {
    return (
      (r.title && r.title.toLowerCase().includes(key)) ||
      (r.productName && r.productName.toLowerCase().includes(key))
    )
  })
})


function openEditDialog(item) {
  editReel.value = {
    id: item.id,
    title: item.title,
    product_id: item.product_id,
    description: item.description
  }
  editDialog.value = true
}

async function updateReel() {
  if (!editFormRef.value.validate()) return

  try {
    const payload = {
      title: editReel.value.title,
      product_id: editReel.value.product_id,
      description: editReel.value.description
    }
    await axios.put(`http://localhost:3000/api/reels/${editReel.value.id}`, payload)
    showSnackbar('Cập nhật reel thành công', 'success')
    editDialog.value = false
    fetchReels()
  } catch (err) {
    console.error('Lỗi cập nhật reel:', err)
    showSnackbar('Cập nhật reel thất bại', 'error')
  }
}

function confirmDelete(item) {
  deleteReel.value = { id: item.id, title: item.title }
  deleteDialog.value = true
}

async function deleteReelConfirmed() {
  try {
    await axios.delete(`http://localhost:3000/api/reels/${deleteReel.value.id}`)
    showSnackbar('Xóa reel thành công', 'success')
    deleteDialog.value = false
    fetchReels()
  } catch (err) {
    console.error('Lỗi xóa reel:', err)
    showSnackbar('Xóa reel thất bại', 'error')
  }
}

// Format ngày tháng
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Snackbar (bạn có thể dùng composable hoặc thay thế bằng alert)
import { useSnackbar } from '@/composables/useSnackbar'
const { showSnackbar } = useSnackbar()
</script>

<style scoped>
video {
  border-radius: 6px;
  background: #000;
}
</style>
