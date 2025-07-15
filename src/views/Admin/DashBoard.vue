<template>
  <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" size="32" class="me-3">mdi-package-variant</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Tổng đơn hàng</span>
              </div>
              <div class="text-h5 font-weight-bold">{{ totalOrders }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="success" size="32" class="me-3">mdi-currency-usd</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Doanh thu</span>
              </div>
              <div class="text-h5 font-weight-bold">{{ formatPrice(totalRevenue) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="info" size="32" class="me-3">mdi-cube-outline</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Sản phẩm</span>
              </div>
              <div class="text-h5 font-weight-bold">{{ totalProducts }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="warning" size="32" class="me-3">mdi-account-group</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Người dùng</span>
              </div>
              <div class="text-h5 font-weight-bold">{{ totalUsers }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Doanh thu 7 ngày gần nhất
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height:327px">
              <LineChart :orders="orders" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Trạng thái đơn hàng
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <div style="height: 200px">
                <PieChart :orders="orders" />
              </div>
              <div class="text-center mt-4">
                <div class="text-h6 font-weight-medium">
                  Tổng số đơn hàng
                </div>
                 <div class="text-h5 font-weight-bold">{{ totalOrders }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        </v-row>
        

        <v-row class="mt-4">
          <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Top sản phẩm bán chạy
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="product in topProducts" :key="product.name">
                <v-list-item-title>{{ product.name }}</v-list-item-title>
                <template v-slot:append>
                  <div class="text-right">
                    <div class="text-body-2 font-weight-medium">
                      Đã bán: {{ product.totalQuantity }}
                    </div>
                    <div class="text-caption text-primary">
                      Doanh thu: {{ formatPrice(product.totalRevenue) }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
  <v-card>
    <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4 d-flex justify-space-between">
      <span>Đánh giá gần đây</span>
      <v-chip color="primary" size="small">
        {{ latestRatings.length }} đánh giá
      </v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list>
      <v-list-item v-for="rating in latestRatings" :key="rating.id">
        <template v-slot:prepend>
          <v-rating
            :model-value="rating.star_rating"
            readonly
            density="compact"
            size="small"
            color="warning"
          ></v-rating>
        </template>
      
        <v-list-item-title>{{ rating.user?.name || 'Ẩn danh' }}</v-list-item-title>
        <v-list-item-subtitle>{{ rating.comment }}</v-list-item-subtitle>
      
        <template v-slot:append>
          <v-chip
            :color="rating.is_approved ? 'success' : 'warning'"
            size="small"
            class="font-weight-medium">
            {{ rating.is_approved ? 'Đã duyệt' : 'Chờ duyệt' }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</v-col>

        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
              <span class="text-subtitle-1 font-weight-medium">Thống kê theo thời gian</span>
              <v-row class="flex-grow-0" style="width: auto">
                <v-col cols="auto">
                  <v-text-field
                    v-model="fromDate"
                    label="Từ ngày"
                    type="date"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-text-field
                    v-model="toDate"
                    label="Đến ngày"
                    type="date"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary" @click="getStatsFromOrders">Xem thống kê</v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text >
              <!-- Summary Cards -->
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Tổng đơn hàng</div>
                      <div class="text-h6">{{ filteredStats.totalOrders }} đơn</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Tổng doanh thu</div>
                      <div class="text-h6">{{ formatPrice(filteredStats.totalRevenue) }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Giá trị TB/đơn</div>
                      <div class="text-h6">{{ formatPrice(filteredStats.avgOrderValue) }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Số ngày</div>
                      <div class="text-h6">{{ filteredStats.days }} ngày</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Chart -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <div style="height: 300px; width: 100%;">
                        <LineChartFiltered :data="filteredStats.revenueByDate" />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

          
  </v-container>
</template>
<script setup>
import { ref, onMounted,computed } from 'vue'
import axios from 'axios'
import LineChart from '@/components/LineChart.vue'
import PieChart from '@/components/PieChart.vue'
import LineChartFiltered from '@/components/LineChartFiltered.vue'

// Biến thống kê
const totalOrders = ref(0)
const totalRevenue = ref(0)
const totalProducts = ref(0)
const orders = ref([])
const ratings = ref([])
const fromDate = ref('')
const toDate = ref('')
const users = ref([])
const totalUsers = computed(() => users.value.length)
const filteredStats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  days: 0,
  revenueByDate: []
})
import { useSnackbar } from '@/composables/useSnackbar'
const { showSnackbar } = useSnackbar()

const getStatsFromOrders = () => {
  if (!fromDate.value || !toDate.value) {
    showSnackbar('Vui lòng chọn khoảng thời gian!', 'warning')
    return
  }

  const startDate = new Date(fromDate.value)
  const endDate = new Date(toDate.value)

  if (startDate > endDate) {
    showSnackbar('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!', 'error')
    return
  }

  endDate.setHours(23, 59, 59, 999)

  // Lọc đơn hàng trong khoảng thời gian
  const filtered = orders.value.filter(order => {
    const createdAt = new Date(order.createdAt)
    return createdAt >= startDate && createdAt <= endDate
  })

  const totalOrders = filtered.length
  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

  // Nhóm doanh thu theo ngày
  const map = new Map()
  filtered.forEach(order => {
    const date = new Date(order.createdAt).toISOString().slice(0, 10)
    if (!map.has(date)) map.set(date, 0)
    map.set(date, map.get(date) + (order.total_amount || 0))
  })

  const revenueByDate = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    revenueByDate.push({
      date: dateStr,
      total: map.get(dateStr) || 0
    })
  }

  filteredStats.value = {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    days,
    revenueByDate
  }
}


onMounted(async () => {
  try {
    // Lấy danh sách sản phẩm
    const productsRes = await axios.get('http://localhost:3000/products')
    if (productsRes.data?.success && Array.isArray(productsRes.data.data)) {
      totalProducts.value = productsRes.data.data.length
    }

    // Lấy danh sách đơn hàng
    const ordersRes = await axios.get('http://localhost:3000/orders/danhsach')
    if (ordersRes.data?.success && Array.isArray(ordersRes.data.data)) {
      orders.value = ordersRes.data.data
      totalOrders.value = orders.value.length

      // Tính tổng doanh thu
      totalRevenue.value = orders.value.reduce((sum, order) => {
        return sum + (order.total_amount || 0)
      }, 0)
    }
    const res = await axios.get('http://localhost:3000/rating')
    if (res.data.success) {
      ratings.value = res.data.data
    }
    const usersRes = await axios.get('http://localhost:3000/users')
    if (usersRes.data?.success && Array.isArray(usersRes.data.data)) {
      users.value = usersRes.data.data
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thống kê:', error)
  }
})
//top đánh giá gần đây
const latestRatings = computed(() => {
  return ratings.value
    .filter(r => r.is_approved) // nếu cần lọc đã duyệt
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // mới nhất trước
    .slice(0, 5)
})

//top sản phẩm bán chayh
const topProducts = computed(() => {
  const productMap = new Map()

  orders.value.forEach(order => {
    order.orderItems.forEach(item => {
      const productName = item.product_variant?.product?.name || 'Unknown'
      const quantity = item.quantity || 0
      const revenue = quantity * (item.price || 0)

      if (!productMap.has(productName)) {
        productMap.set(productName, { name: productName, totalQuantity: 0, totalRevenue: 0 })
      }

      const productData = productMap.get(productName)
      productData.totalQuantity += quantity
      productData.totalRevenue += revenue
    })
  })

  // Chuyển map thành mảng và sắp xếp giảm dần theo số lượng
  return Array.from(productMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5) // lấy top 5
})
// Format tiền tệ
const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(val)
</script>

