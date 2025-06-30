<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" max-width="1000" elevation="8">
      <v-card-title class="text-h5 font-weight-bold text-center">
        {{ isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!' }}
      </v-card-title>

      <v-card-text class="text-body-1 mt-4">
        <div class="text-center">
          <v-icon :color="isSuccess ? 'success' : 'error'" size="60">
            {{ isSuccess ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
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
            
            Trạng thái: {{ message }}
          </p>

          <div class="order-main-row">
            <div class="order-info-col">
              <div class="order-info-row mb-4">
                <div class="order-info-item">
                  <span class="label">Mã đơn hàng:</span>
                  <strong>{{ order.id }}</strong>
                </div>
                <div class="order-info-item">
                  <span class="label">Thanh toán qua:</span>
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
                  class="mb-4"
                >
                  <v-card class="pa-2 d-flex align-center" style="max-width: 450px;">
                    <v-img
                      :src="item.product.product_image[0]?.url"
                      alt="Ảnh sản phẩm"
                      class="product-img"
                      contain
                    />
                    <div class="flex-grow-1">
                      <div class="font-weight-medium text-truncate" style="max-width: 300px;">
                        {{ item.product.name }}
                      </div>
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

            <!-- Tóm tắt đơn hàng -->
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
        <v-btn color="primary" @click="goHome">Quay lại Trang chủ</v-btn>
        <v-btn variant="tonal" @click="goToOrders">Xem đơn hàng</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCart } from '@/store/useCart'

const route = useRoute()
const router = useRouter()
const { clearCart } = useCart()

const transactionId = ref('')
const isSuccess = ref(false)
const message = ref('')
const order = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const query = route.query
  const orderId = query.vnp_TxnRef
  transactionId.value = orderId || 'Không có'
  isSuccess.value = query.status === 'success'
  message.value = query.message || (isSuccess.value ? 'Thanh toán thành công' : 'Thanh toán thất bại')

  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng.'
    loading.value = false
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users/${orderId}`)
    order.value = res.data.data
    if (isSuccess.value) clearCart()
  } catch (err) {
    console.error(err)
    error.value = 'Không thể lấy thông tin đơn hàng.'
  } finally {
    loading.value = false
  }
})

function goHome() {
  router.push('/')
}

function goToOrders() {
  router.push('/order')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}
</script>

<style scoped>
/* Tái sử dụng toàn bộ style từ cod-return.vue để đồng nhất */
.text-center {
  text-align: center;
}
.v-card {
  width: 100%;
  max-width: 1000px !important;
}
.order-main-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
}
.order-info-col {
  flex: 1 1 320px;
  min-width: 300px;
}
.order-items-col {
  flex: 0 1 70%;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid #ddd;
}
.order-summary-col {
  flex: 0 1 28%;
  min-width: 250px;
  padding-left: 20px;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.product-img {
  width: 100px;
  height: 130px;
  border-radius: 8px;
  object-fit: contain;
}
.order-info-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}
.order-info-item {
  flex: 1 1 30%;
  min-width: 90px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.order-info-item .label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
  font-size: 0.9rem;
}
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
</style>
