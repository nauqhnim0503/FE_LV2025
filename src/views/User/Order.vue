<template>
  <v-container>
    <!-- Header -->
    <h2 class="text-h5 font-weight-medium mb-6">Đơn hàng của tôi</h2>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="all">Tất cả đơn</v-tab>
      <v-tab value="Chờ xác nhận">Chờ xác nhận</v-tab>
      <v-tab value="Đã xác nhận">Đã xác nhận</v-tab>
      <v-tab value="Đang vận chuyển">Đang vận chuyển</v-tab>
      <v-tab value="Đã giao">Đã giao</v-tab>
      <v-tab value="Đã hủy">Đã hủy</v-tab>
    </v-tabs>

    <!-- Search Bar -->
    <v-card class="mb-6" variant="flat">
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Tìm đơn hàng theo Mã đơn hàng hoặc sản phẩm"
          variant="outlined"
          density="comfortable"
          hide-details
        >
          <template v-slot:append>
            <v-btn color="primary" @click="handleSearch">Tìm</v-btn>
          </template>
        </v-text-field>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center my-8">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Orders List -->
    <template v-else>
      <template v-if="filteredOrders.length > 0">
        <v-card v-for="order in filteredOrders" :key="order.id" class="mb-4 rounded-lg">
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <div class="d-flex align-center">
                <v-icon color="primary" class="me-2">mdi-store</v-icon>
                <v-chip :color="getStatusColor(order.status)" size="small">
                  {{ statusMap[order.status] || 'Không xác định' }}
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis">
                Ngày đặt: {{ formatDate(order.created_at) }}
              </div>
            </div>

           
            <!-- Order Items -->
            <div
              v-for="item in order.orderItems"
              :key="item.id"
              class="d-flex align-start order-item-row">
              <div class="order-image-wrapper me-4">
                <v-img
                  :src="item.product?.product_image?.[0]?.url"
                  class="order-image rounded"
                  contain/>
              </div>
              <div class="flex-grow-1">
                <div class="text-body-1 font-weight-medium">{{ item.product?.name || 'Không rõ sản phẩm' }}</div>
                <div class="text-caption text-medium-emphasis">
                  Phân loại: {{ item.product_variant?.colors?.name || 'Mặc định' }} - {{ item.product_variant?.sizes?.name || 'Mặc định' }}
                </div>
                <div class="text-caption">x{{ item.quantity }}</div><br>
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      v-if="order.status === 'Đã giao'"
                      @click="ratedMap.has(`${order.id}-${item.product_id}`) ? handleRebuy(item) : openReviewDialog(item, order)">
                      {{ ratedMap.has(`${order.id}-${item.product_id}`) ? '🛒 Mua lại' : '⭐ Đánh giá' }}
                    </v-btn>
              </div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-text class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon size="20" color="grey" class="me-2">mdi-cash</v-icon>
              <span class="text-body-2 font-title">{{ order.payment_method }}</span>
            </div>
            <div class="d-flex align-center ">
              <span class="me-4">Tổng tiền: <strong class="text-primary price">{{ formatPrice(order.total_amount) }}</strong></span>
              <v-btn :to="{ name: 'OrderDetail', params: { id: order.id } }" color="primary" variant="tonal">Xem chi tiết</v-btn>
              <v-btn v-if="order.status === 'Chờ xác nhận'" class="ms-2 font-title" color="error" variant="text" @click="openCancelDialog(order)">Hủy đơn</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Pagination -->
        <div class="d-flex justify-center py-4">
          <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" rounded="circle" />
        </div>
      </template>
      
      <!-- Empty -->
      <v-card v-else class="pa-12 text-center rounded-lg">
        
        <h3 class="text-h6 font-weight-medium mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">Hãy khám phá các sản phẩm và đặt hàng ngay!</p>
        <v-btn color="primary" to="/products" prepend-icon="mdi-shopping" size="large">Mua sắm ngay</v-btn>
      </v-card>
    </template>
  </v-container>
  <v-dialog v-model="reviewDialog" max-width="500">
  <v-card>
    <v-card-title class="text-h6 font-weight-medium">
      Đánh giá sản phẩm
    </v-card-title>

    <v-card-text>
      <div class="d-flex mb-4">
        <v-img
          :src="selectedItem?.image_url"
          class="rounded me-4 review-dialog-image"
          contain/>
        <div class="flex-grow-1">
          <div class="text-body-1 font-weight-medium">
            {{ selectedItem?.product_name }}
          </div>
          <div class="text-caption text-medium-emphasis mb-1">
            Phân loại: {{ selectedItem?.variant }}
          </div>
          <div class="text-primary">
            {{ formatPrice(selectedItem?.total_price || 0) }}
          </div>
        </div>
      </div>

      <!-- Star Rating -->
      <div class="mb-3">
        <span class="text-subtitle-2 font-weight-medium mb-2 d-block">Đánh giá của bạn</span>
        <v-rating
          v-model="reviewForm.rating"
          color="amber"
          background-color="grey-lighten-1"
          length="5"
          size="30"/>
      </div>

      <!-- Comment -->
      <v-textarea
        v-model="reviewForm.comment"
        label="Nhận xét của bạn"
        placeholder="Viết đánh giá (tối đa 500 ký tự)"
        maxlength="500"
        counter
        auto-grow
        rows="5"
        variant="outlined"/>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn variant="text" @click="reviewDialog = false">Hủy</v-btn>
      <v-btn color="primary" @click="submitReview">Gửi đánh giá</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="cancelDialog" max-width="500">
  <v-card>
    <v-card-title class="text-h6 font-weight-medium">Xác nhận hủy đơn</v-card-title>
    <v-card-text>
      Bạn có chắc chắn muốn hủy đơn hàng <strong>{{ orderToCancel?.id }}</strong> không?<br />
      Hành động này không thể hoàn tác.
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn variant="text" @click="cancelDialog = false">Không</v-btn>
      <v-btn color="error" @click="confirmCancelOrder">Hủy đơn</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  <FloatingContact />
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted,watch } from 'vue'
import { getUser } from '@/store/auth'
import { useSnackbar  } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'
import FloatingContact from '@/components/FloatingContact.vue'

const router = useRouter()
const loading = ref(false)
const {showSnackbar} = useSnackbar()

const orders = ref([])
//user
const user = getUser()
const userId = user?.id
// Tab & Search
const activeTab = ref('all')
const searchQuery = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
//rating
const reviewDialog = ref(false)
const selectedItem = ref(null)
const ratedMap = ref(new Map())
const reviewForm = ref({
  rating: 0,
  comment: ''
})
//size&màu
const colors = ref([])
const sizes = ref([])
//hủy đơn
const cancelDialog = ref(false)
const orderToCancel = ref(null)
const openCancelDialog = (order) => {
  orderToCancel.value = order
  cancelDialog.value = true
}

const openReviewDialog = (item, order) => {
  selectedItem.value = {
    ...item,
    order_id: order.id,
    image_url: item.product?.product_image?.[0]?.url || '',
    variant: `${item.product_variant?.colors?.name || 'Mặc định'} - ${item.product_variant?.sizes?.name || 'Mặc định'}`,
    product_name: item.product?.name || 'Tên sản phẩm',
    total_price: (item.product?.promotional || item.price) * item.quantity
  }

  reviewForm.value = {
    rating: 0,
    comment: ''
  }
  reviewDialog.value = true
}

// Gọi API khi component mounted
onMounted(async () => {
  await fetchOrders()
  await fetchColorsAndSizes()
  const stored = JSON.parse(localStorage.getItem('ratedMap') || '{}')
  ratedMap.value = new Map(Object.entries(stored))
})
const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/users/order/${userId}`)
    if (response.data.success) {
      const ordersData = response.data.data
      if (ordersData.length === 0) {
        // Chưa có đơn hàng, có thể xử lý UI riêng (vd: hiện "Bạn chưa có đơn hàng")
        orders.value = []
        // Không báo lỗi
      } else {
        orders.value = ordersData.map(order => ({
          ...order,
          created_at: order.createdAt,
          orderItems: order.orderItems || [],
        }))
      }
    } else {
      // Nếu success = false thì báo lỗi
      showSnackbar('Lỗi khi tải đơn hàng', 'error')
    }
  } catch (error) {
    showSnackbar('Lỗi khi tải đơn hàng', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Lấy màu và size
const fetchColorsAndSizes = async () => {
  try {
    const [colorsRes, sizesRes] = await Promise.all([
      axios.get('http://localhost:3000/colors'),
      axios.get('http://localhost:3000/sizes')
    ])

    colors.value = colorsRes.data.data || []
    sizes.value = sizesRes.data.data || []
  } catch (error) {
    console.error('Lỗi tải màu hoặc size', error)
  }
}
// Computed filtered orders
const handleSearch = () => {
  searchKeyword.value = searchQuery.value.trim()
}

const filteredOrders = computed(() => {
  let filtered = orders.value

  if (activeTab.value !== 'all') {
    filtered = filtered.filter((o) => o.status === activeTab.value)
  }

  if (searchKeyword.value) {
    const q = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.orderItems.some((item) => item.product.name.toLowerCase().includes(q))
    )
  }

  return filtered
})
//mua lại
const handleRebuy = (item) => {
  // Điều hướng đến trang chi tiết sản phẩm theo product_id
  router.push({ name: 'ProductDetail', params: { id: item.product_id } })
}
// Formatters
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
//hủy đơn
const confirmCancelOrder = async () => {
  try {
    const orderId = orderToCancel.value?.id
    if (!orderId) return

    const response = await axios.post(`http://localhost:3000/orders/${orderId}/cancel`)
    if (response.data.success) {
      showSnackbar('Đơn hàng đã được hủy thành công', 'success')
      await fetchOrders()
    } else {
      showSnackbar(response.data.message || 'Không thể hủy đơn hàng', 'error')
    }
  } catch (err) {
    console.error(err)
    showSnackbar('Lỗi khi hủy đơn hàng', 'error')
  } finally {
    cancelDialog.value = false
    orderToCancel.value = null
  }
}


const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(val)

const statusMap = {
  'Chờ xác nhận': 'Chờ xác nhận',
  'Đã xác nhận': 'Đã xác nhận',
  'Đang vận chuyển': 'Đang vận chuyển',
  'Đã giao': 'Đã giao',
  'Đã hủy': 'Đã hủy'
}
const getStatusColor = (status) => ({
  'Chờ xác nhận': 'warning',
  'Đã xác nhận': 'info',
  'Đang vận chuyển': 'primary',
  'Đã giao': 'success',
  'Đã hủy': 'error',
}[status] || 'grey')
//rating
const submitReview = async () => {
  if (reviewForm.value.rating < 1 || reviewForm.value.rating > 5) {
    return showSnackbar('Vui lòng chọn số sao từ 1 đến 5.', 'warning')
  }

  if (reviewForm.value.comment.trim() === '') {
    return showSnackbar('Vui lòng nhập nhận xét.', 'warning')
  }

   console.log({
    user_id: userId,
    order_id: selectedItem.value.order_id,
    product_id: selectedItem.value.product_id,
    star_rating: reviewForm.value.rating,
    comment: reviewForm.value.comment
  });

  try {
    await axios.post('http://localhost:3000/rating/', {
      user_id: userId,
      order_id: selectedItem.value.order_id,
      product_id: selectedItem.value.product_id,
      star_rating: reviewForm.value.rating,
      comment: reviewForm.value.comment
    })
    ratedMap.value.set(`${selectedItem.value.order_id}-${selectedItem.value.product_id}`, true)
    showSnackbar('Đánh giá đã được gửi!', 'success')
    reviewDialog.value = false
  } catch (err) {
    console.error(err)
    showSnackbar('Không thể gửi đánh giá.', 'error')
  }
}
watch(ratedMap, () => {
  const obj = Object.fromEntries(ratedMap.value)
  localStorage.setItem('ratedMap', JSON.stringify(obj))
}, { deep: true })
</script>

<style scoped>
.v-img {
  border-radius: 8px;
  object-fit: cover;
}
.font-title {
  font-family: 'Playfair Display', serif !important;
}
.v-textarea textarea {
  font-size: 14px;
}
.v-rating {
  margin-bottom: 8px;
}
.order-item-row {
  height: 150px; 
  margin-bottom: 16px;
  padding: 0;
  align-items: center;
  line-height: normal;
}

.order-image-wrapper {
  width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
}

.order-image {
  width: 150px !important;
  height: 150px !important;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}
.review-dialog-image {
  width: 10px !important;  /* tăng chiều rộng */
  height: 160px !important; /* tăng chiều cao */
  object-fit: cover;         /* giữ tỉ lệ và crop đúng */
  border-radius: 8px;
}
</style>
