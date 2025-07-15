<template>
  <v-container>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-icon color="primary" size="28" class="me-3">mdi-package</v-icon>
        <h2 class="text-h5 font-weight-medium mb-0">Chi tiết đơn hàng</h2>
      </div>
      <v-btn to="/order" prepend-icon="mdi-arrow-left" variant="text">
        Quay lại
      </v-btn>
    </div>

    <v-row>
      <!-- Left side: Order & items -->
      <v-col cols="12" md="8">
        <!-- Trạng thái đơn hàng -->
        <v-card class="mb-4 pt-4">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-1 font-weight-medium">Trạng thái
                <v-chip :color="order?.status === 'Chờ xác nhận' ? 'warning' : 'primary'" size="small">
                  {{ order?.status || 'Đang xử lý' }}
                </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">
                  Mã đơn hàng: <strong>{{ order?.id || 'Chưa có mã' }}</strong>
                </div>
              </div>
              <div>
                <v-chip color="blue" size="small">
                  Phương thức thanh toán: <strong> {{ order?.payment_method || 'Chưa thanh toán' }} </strong> 
                </v-chip>
              </div>
            </div>
            <div class="text-caption text-medium-emphasis mt-2">
              Ngày đặt: {{ formatDate(order?.createdAt) || '' }}
            </div>
          </v-card-text>
        </v-card>

        <!-- Danh sách sản phẩm -->
        <v-card class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-medium">
            Sản phẩm đã mua
          </v-card-title>
        <v-divider></v-divider>
          <v-card-text>
          <div
          v-for="item in order?.orderItems" 
          :key="item.id"
          class="d-flex mb-4">
          <!-- Ảnh sản phẩm -->
          <v-img
            :src="item.product?.product_image?.[0]?.url"
            width="50"
            height="100"
            class="custom-img rounded me-4 bg-grey-lighten-3"
            cover/>

          <!-- Thông tin -->
          <div class="flex-grow-1 d-flex flex-column justify-start">
            <div class="text-body-1 font-weight-medium mb-1">
              {{ item.product?.name || 'Tên sản phẩm không rõ' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Phân loại:
              {{ item.product_variant?.colors?.name || 'Mặc định' }} -
              {{ item.product_variant?.sizes?.name || 'Mặc định' }}
            </div>
            <div class="text-caption mt-1">
              Số lượng: x{{ item.quantity }}
            </div>
          </div>

          <!-- Giá -->
          <div class="text-right text-no-wrap ms-4">
            <div class="text-primary font-weight-medium price">
              {{ formatPrice((item.product?.promotional || item.price) * item.quantity) }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    </v-col>

      <!-- Right side: Info & tổng tiền -->
      <v-col cols="12" md="4">
        <!-- Thông tin người nhận -->
        <v-card class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-medium">
            Thông tin nhận hàng
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-account</v-icon>
                </template>
                <v-list-item-title>Người nhận</v-list-item-title>
                <v-list-item-subtitle>{{ order?.name || 'Nguyễn Văn A' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-phone</v-icon>
                </template>
                <v-list-item-title>Số điện thoại</v-list-item-title>
                <v-list-item-subtitle>{{ order?.phone || '0123456789' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>Địa chỉ</v-list-item-title>
                <v-list-item-subtitle class="text-wrap">
                  {{ order?.address || '123 Đường ABC, Quận 1, TP.HCM' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Tổng thanh toán -->
        <v-card>
          <v-card-title class="text-subtitle-1 font-weight-medium">
            Tổng thanh toán
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span>Tạm tính</span>
              <span class="price">{{ formatPrice(order?.subtotal) || '600.000 ₫' }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Giảm giá</span>
              <span class="text-error">
                -{{ formatPrice(order?.discount_amount) || '50.000 ₫' }}
              </span>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="d-flex justify-space-between text-h6 font-weight-medium">
              <span>Tổng cộng</span>
              <span class="text-primary">
                {{ formatPrice(order?.total_amount) || '550.000 ₫' }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <FloatingContact />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import FloatingContact from '@/components/FloatingContact.vue'

const route = useRoute()
const orderId = route.params.id

const order = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/users/${orderId}`)
    if (res.data.success) {
      order.value = res.data.data
    }
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng:', err)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(val)
</script>


<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}
.v-list-item:last-child {
  border-bottom: none;
}
.v-list-item-subtitle {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  display: block !important;
}
.custom-img {
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: 150px !important;
  max-height: 150px !important;
  width: 150px !important;
  height: 150px !important;
}
</style>
