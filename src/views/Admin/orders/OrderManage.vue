<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý đơn hàng</h2>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Tìm kiếm đơn hàng"
                v-model="search"
                prepend-icon=""
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="text-right">
              <v-select
                v-model="selectedStatus"
                :items="status"
                item-title="name"
                item-value="id"
                label="Trạng thái đơn hàng"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>
            <v-col cols="4" class="text-right">
              <v-select
                v-model="selectedPayment"
                :items="payment_method"
                item-title="name"
                item-value="id"
                label="Phương thức thanh toán"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>
          </v-row>

        <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title>Cập nhật trạng thái đơn hàng</v-card-title>
              <v-card-text>
                <v-select
                  v-model="editedStatus"
                  :items="allowedStatus"
                  label="Trạng thái mới"
                  dense
                  variant="solo"
                  outlined
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Hủy</v-btn>
                <v-btn color="primary" @click="updateStatus">Lưu</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

          <v-data-table
            :headers="headers"
            :items="filteredOrders"
            v-model:page="page"
            :items-per-page="itemsPerPage"
            class="elevation-1 mt-4">
            <!-- Số thứ tự -->
            <template #item.stt="{ index }">
              {{ index + 1 }}
            </template>
            <!-- thông tin khách hàng -->
            <template #item.customerInfo="{ item }">
              <div>
                <div><strong>Họ tên:</strong> {{ item.name || '—' }}</div>
                <div><strong>Địa chỉ:</strong> {{ item.address || '—' }}</div>
                <div><strong>Điện thoại:</strong> {{ item.phone || '—' }}</div>
              </div>
            </template>
            <!-- phương thức thanh toán -->
             <template #item.paymentMethod="{ item }">
              <div>
                <div style="color: #42A5F5;">{{ formatCurrency(item.total_amount) }} đ</div>
                <div style="color: rgba(128, 128, 128, 0.5);"> {{ item.payment_method || '—' }}</div>
              </div>
            </template>
            <!-- Ngày tạo -->
            <template #item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <!-- Thao tác -->
            <template #item.actions="{ item }">
              <div class="d-flex justify-center gap-2">
                <v-tooltip text="Cập nhật trạng thái đơn hàng" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="primary"
                     @click="openEditDialog(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Xem thông tin đơn hàng" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="primary"
                      @click="viewOrderDetail(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <!-- Không có dữ liệu -->
            <template #no-data>
              <v-alert type="info" border="start" text>
                Không có đơn hàng nào phù hợp với từ khóa "{{ search }}"
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

  <!-- Dialog xem chi tiết đơn hàng -->
<v-dialog v-model="detailDialog" max-width="600px">
  <v-card>
    <v-card-title class="headline">Chi tiết đơn hàng</v-card-title>
    <v-card-text v-if="selectedOrder" class="order-detail print-area">
      <div class="info-row"><span class="label">Mã đơn hàng:</span> <span>{{ selectedOrder.id }}</span></div>
      <div class="info-row"><span class="label">Khách hàng:</span> <span>{{ selectedOrder.name }}</span></div>
      <div class="info-row"><span class="label">Địa chỉ:</span> <span>{{ selectedOrder.address }}</span></div>
      <div class="info-row"><span class="label">Điện thoại:</span> <span>{{ selectedOrder.phone }}</span></div>
      <div class="info-row"><span class="label">Phương thức thanh toán:</span> <span>{{ selectedOrder.payment_method }}</span></div>
      <div class="info-row"><span class="label">Trạng thái:</span> <span>{{ selectedOrder.status }}</span></div>
      <div class="info-row"><span class="label">Ngày tạo:</span> <span>{{ formatDate(selectedOrder.createdAt) }}</span></div>
        
      <v-divider class="my-3"></v-divider>
        
      <h3>Danh sách sản phẩm</h3>
      <v-list dense>
        <v-list-item v-for="(item, index) in selectedOrder.orderItems" :key="index">
          <v-list-item-content>
            <div class="product-line">
              <strong>{{ item.product_variant?.product.name }}</strong>
              <div>SL: {{ item.quantity }} | Giá: {{ formatCurrency(item.price) }} đ</div>
              <div>
                <span v-if="item.product_variant?.colors">Màu: {{ item.product_variant?.colors?.name }}</span>
                <span v-if="item.product_variant?.sizes"> | Size: {{ item.product_variant?.sizes?.name }}</span>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    
      <v-divider class="my-3"></v-divider>
      <div class="info-row"><span class="label">Tạm tính:</span> <span>{{ formatCurrency(selectedOrder.subtotal) }} đ</span></div>
      <div class="info-row"><span class="label">Giảm giá:</span> <span>{{ formatCurrency(selectedOrder.discount_amount ?? 0) }} đ</span></div>
      <div class="info-row total"><span class="label">Tổng tiền:</span> <span>{{ formatCurrency(selectedOrder.total_amount) }} đ</span></div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="printOrder">In đơn hàng</v-btn>
      <v-btn color="primary" @click="detailDialog = false">Đóng</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </v-container>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar  } from '@/composables/useSnackbar'


const {showSnackbar} = useSnackbar()
const search = ref('');
const orders = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const selectedStatus = ref(null)
const selectedPayment = ref(null)
//update trạng thái đơn
const dialog = ref(false);
const editedOrder = ref(null);
const editedStatus = ref('');
const allowedStatus = ref([]);
const detailDialog = ref(false);
const selectedOrder = ref(null);

function viewOrderDetail(order) {
  selectedOrder.value = order;
  detailDialog.value = true;
}
//in đơn 
function printOrder() {
  const printContents = document.querySelector('.print-area').innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // để reload lại UI sau khi in
}

const headers = [
  { title: 'STT', key: 'stt', align: 'left', width: '40' },
  { title: 'Mã đơn hàng', key: 'id', align: 'left',width: '120' },
  { title: 'Thông tin khách hàng', key: 'customerInfo', align: 'left', width: '200' },
  { title: 'Tổng tiền', key: 'paymentMethod', align: 'left', width: '100' },
  { title: 'Trạng thái', key: 'status', align: 'left', width: '100' },
  { title: 'Ngày tạo', key: 'createdAt', align: 'left', width: '150' },
  { title: 'Thao tác', key: 'actions', align: 'center', width: '120' }
];
// Trạng thái có thể chuyển tiếp tùy theo trạng thái hiện tại
const validStatusTransitions = {
  'Chờ xác nhận': ['Đã xác nhận', 'Đã hủy'],
  'Đã xác nhận': ['Đang vận chuyển', 'Đã hủy'],
  'Đang vận chuyển': ['Đã giao'],
  'Đã giao': [], // Không thể quay lại
  'Đã hủy': []   // Không thể quay lại
};
onMounted(fetchOrders);

async function fetchOrders() {
  try {
    const res = await axios.get('http://localhost:3000/orders/danhsach');
    orders.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch đơn hàng:', err);
    showSnackbar('Lỗi khi tải danh sách đơn hàng','error')
  }
}
//tìm kiếm & lọc
const filteredOrders = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  return orders.value.filter(order => {
    // Check filter theo search (name, id, phone)
    const matchSearch =
      (!keyword) ||
      (order.name && order.name.toLowerCase().includes(keyword)) ||
      (order.id && order.id.toLowerCase().includes(keyword)) ||
      (order.phone && order.phone.includes(keyword))

    // Check filter theo trạng thái (nếu đã chọn)
    const matchStatus = !selectedStatus.value || order.status === selectedStatus.value

    // Check filter theo phương thức thanh toán (nếu đã chọn)
    const matchPayment = !selectedPayment.value || order.payment_method === selectedPayment.value

    // Phải thỏa cả 3 điều kiện
    return matchSearch && matchStatus && matchPayment
  })
})

//select
const payment_method = computed(() => {
  // Lấy ra danh sách payment_method duy nhất từ orders
  const methods = orders.value.map(o => o.payment_method)
  return [...new Set(methods)].map(m => ({ id: m, name: m }))
})

const status = computed(() => {
  // Lấy ra danh sách status duy nhất từ orders
  const statuses = orders.value.map(o => o.status)
  return [...new Set(statuses)].map(s => ({ id: s, name: s }))
})



function openEditDialog(order) {
  editedOrder.value = order;
  editedStatus.value = order.status;
  const currentStatus = order.status;
  allowedStatus.value = validStatusTransitions[currentStatus] || [];
  dialog.value = true;
}

async function updateStatus() {
  if (!editedOrder.value || !editedStatus.value) return;

  const currentStatus = editedOrder.value.status;
  const validNextStatuses = validStatusTransitions[currentStatus] || [];

  if (!validNextStatuses.includes(editedStatus.value)) {
    showSnackbar('Chuyển trạng thái không hợp lệ ❌', 'error');
    return;
  }

  try {
    const orderId = editedOrder.value.id;
    const status = editedStatus.value;

    // Gọi API update trạng thái (theo backend bạn có thể dùng PUT/PATCH hoặc POST)
    await axios.patch(`http://localhost:3000/orders/${orderId}`, { status });

    // Cập nhật trạng thái trên frontend luôn để UI đồng bộ
    editedOrder.value.status = status;
    showSnackbar('Cập nhật trạng thái đơn hàng thành công ✅','success')
    // Đóng dialog
    dialog.value = false;
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái:', error);
    
  }
}

//formant $$$$
function formatCurrency(value) {
  return (Number(value) || 0).toLocaleString('vi-VN');
}


// Format ngày giờ
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
.order-detail {
  font-size: 14px;
  line-height: 1.6;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #ccc;
}

.label {
  font-weight: 600;
  min-width: 130px;
  color: #555;
}

.total {
  font-size: 16px;
  font-weight: bold;
  color: #1e88e5;
  border-top: 2px solid #eee;
  margin-top: 10px;
  padding-top: 8px;
}

.product-line {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
@media print {
  body * {
    visibility: hidden;
  }

  .print-area, .print-area * {
    visibility: visible;
  }

  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px;
    font-size: 14px;
    color: #000;
    background: #fff;
  }
}
</style>
