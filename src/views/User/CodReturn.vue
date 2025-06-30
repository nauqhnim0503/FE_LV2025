<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" max-width="1000" elevation="8">
      <v-card-title class="text-h5 font-weight-bold text-center">
        Đặt hàng thành công!
      </v-card-title>
      <v-card-text class="text-body-1 mt-4">
        <div class="text-center">
          <v-icon color="success" size="60">mdi-check-circle</v-icon>
        </div>

        <div v-if="loading" class="mt-4 text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="error" class="mt-4">
          <v-alert type="error" variant="tonal">
            {{ error }}
          </v-alert>
        </div>
        <div v-else-if="order" class="order-content mt-4">
  <p class="mb-3 text-center">
    Cảm ơn bạn đã đặt hàng.<br />
    Đơn hàng đã được tiếp nhận và đang được xử lý.
  </p>

  <div class="order-main-row">
    <!-- Thông tin đơn hàng (bên trái trên cùng) -->
    <div class="order-info-col">
      <div class="order-info-row mb-4">
        <div class="order-info-item">
          <span class="label">Mã đơn hàng:</span>
          <strong>{{ order.id }}</strong>
        </div>
        <div class="order-info-item">
          <span class="label">Hình thức thanh toán:</span>
          <strong>{{ order.payment_method }}</strong>
        </div>
        <div class="order-info-item">
          <span class="label">Tổng tiền:</span>
          <strong>{{ formatCurrency(order.total_amount) }}</strong>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>
    </div>
  </div>

  <!-- Flex container cho danh sách sản phẩm và tóm tắt tiền cùng hàng -->
  <div class="order-items-summary-row">
    <!-- Danh sách sản phẩm -->
    <div class="order-items-col">
      <h4 class="text-subtitle-1 font-weight-medium mb-4 text-center">
        Sản phẩm đã đặt
      </h4>

      <div class="items-list">
  <div
    v-for="item in order.orderItems"
    :key="item.id"
    class="mb-4">
    <v-card class="pa-2 d-flex align-center" style="max-width: 450px;">
      <v-img
        :src="item.product.product_image[0]?.url"
        alt="Ảnh sản phẩm"
        class="product-img"
        contain />
      <div class="flex-grow-1">
        <div class="font-weight-medium text-truncate" style="max-width: 300px;">{{ item.product.name }}</div>
        <div class="text-caption grey--text">
          Màu: {{ item.product_variant.colors.name }} |
          Size: {{ item.product_variant.sizes.name }}
        </div>
        <div class="text-caption">
          Số lượng: {{ item.quantity }}
        </div>
      </div>
    </v-card>
  </div>
</div>

    </div>

    <!-- Tóm tắt tạm tính, giảm giá, tổng cộng -->
    <div class="order-summary-col">
      <h4 class="text-subtitle-1 font-weight-medium mb-4 text-center">
        Tóm tắt đơn hàng
      </h4>
      <div class="summary-line">
        <span>Tạm tính:</span>
        <strong>{{ formatCurrency(order.subtotal) }}</strong>
      </div>
      <div class="summary-line">
        <span>Giảm giá:</span>
        <strong>-{{ formatCurrency(order.discount_amount) }}</strong>
      </div>
      <div class="summary-line total">
        <span>Tổng cộng:</span>
        <strong>{{ formatCurrency(order.total_amount) }}</strong>
      </div>
    </div>
  </div>
</div>
        
      </v-card-text>

      <v-card-actions class="justify-center mt-6">
        <v-btn color="primary" @click="goHome">
          Quay lại trang chủ
        </v-btn>
        <v-btn variant="tonal" @click="goToOrders">
          Xem đơn hàng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const orderId = route.query.orderId || null
const order = ref(null)
const loading = ref(true)
const error = ref('')

// Gọi API lấy chi tiết đơn hàng
onMounted(async () => {
  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng.'
    loading.value = false
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users/${orderId}`) // Cập nhật endpoint đúng
    order.value = res.data.data
  } catch (err) {
    console.error('Lỗi khi fetch đơn hàng:', err)
    error.value = 'Không thể lấy thông tin đơn hàng.'
  } finally {
    loading.value = false
  }
})

function goHome() {
  router.push('/')
}

function goToOrders() {
  router.push('order')
}
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

</script>


<style scoped>
.text-center {
  text-align: center;
}

/* Mở rộng card */
.v-card {
  width: 100%;
  max-width: 1000px !important;
}

/* Bố cục ngang chính */
.order-main-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Cột thông tin đơn hàng */
.order-info-col {
  flex: 1 1 320px;
  min-width: 300px;
}

/* Cột danh sách sản phẩm */
.order-items-col {
  flex: 0 1 70%;
  height: 200px; /* dùng height thay vì max-height để đảm bảo khung cố định */
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  scrollbar-width: thin;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
}
.items-list::-webkit-scrollbar {
  width: 6px;
}
.items-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.product-img {
  width: 100px;
  height: 130px;
  border-radius: 8px;
  object-fit: contain;
}

/* Flex container cho thông tin đơn hàng nhỏ */
.order-info-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}

/* Mỗi mục info */
.order-info-item {
  flex: 1 1 30%;
  min-width: 90px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
}

/* Label nhỏ màu xám */
.order-info-item .label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

/* Phần tóm tắt tính tiền */
.summary-line {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 1rem;
}
.summary-line.total {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Ảnh sản phẩm to hơn */
.v-img.rounded {
  border-radius: 8px;
}

/* Giới hạn text tên sản phẩm nếu quá dài */
.text-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.order-items-summary-row {
  display: flex;
  gap: 40px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 24px;
}

/* Danh sách sản phẩm rộng hơn */
.order-items-col {
  flex: 0 1 70%;
  max-height: 500px; /* tùy chỉnh chiều cao tối đa */
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid #ddd;
}

/* Phần tóm tắt tiền chiếm khoảng 30% */
.order-summary-col {
  flex: 0 1 28%;
  min-width: 250px;
  padding-left: 20px;
}

/* Đảm bảo chiều cao tối thiểu cho 2 cột đồng đều */
.order-items-col, .order-summary-col {
  box-sizing: border-box;
}
.order-items-col {
  flex: 0 1 70%;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid #ddd;
  scrollbar-width: thin;
}

</style>

