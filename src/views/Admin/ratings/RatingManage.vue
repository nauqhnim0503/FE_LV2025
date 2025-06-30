<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý đánh giá</h2>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Tìm kiếm đánh giá"
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
                label="Trạng thái phê duyệt"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>
            <v-col cols="4" class="text-right">
              <v-select
                v-model="selectedRating"
                :items="rating"
                item-title="name"
                item-value="id"
                label="Số sao"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @update:model-value="handleFilterChange"
              ></v-select>
            </v-col>
          </v-row>

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
            <!-- Thông tin khách hàng -->
            <template #item.customerInfo="{ item }">
              <div>
                <div><strong>Họ tên:</strong> {{ item.user?.name || '—' }}</div>
                <div><strong>Điện thoại:</strong> {{ item.user?.phone || '—' }}</div>
              </div>
            </template>
            <!-- Trạng thái phê duyệt -->
            <template #item.status="{ item }">
              <div>
                {{ item.is_approved === 0 ? 'Chờ duyệt' : item.is_approved === 1 ? 'Đã duyệt' : item.is_approved === 2 ? 'Từ chối' : '—' }}
              </div>
            </template>

            <!-- Sản phẩm -->
            <template #item.product="{ item }">
              <div>
                <strong>Tên sản phẩm:</strong> {{ item.product.name || '—' }}<br>
                <strong>Mã sản phẩm:</strong> {{ item.product.id || '—' }}
              </div>
            </template>
            <!-- Đánh giá -->
            <template #item.star_rating="{ item }">
              <div>
                <v-rating
                  v-model="item.star_rating"
                  color="yellow"
                  readonly
                  size="20"
                ></v-rating>
              </div>
            </template>
            <template #item.comment="{ item }">
              <div>{{ item.comment || '—' }}</div>
            </template>
            <!-- Ngày tạo -->
            <template #item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <!-- Thao tác -->
            <template #item.actions="{ item }">
              <div class="d-flex justify-center gap-2">
                <!-- Nút Duyệt -->
                <v-btn
                  icon
                  density="comfortable"
                  variant="text"
                  color="success"
                  @click="updateApprovalStatus(item.id, 1)">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
            
                <!-- Nút Từ chối -->
                <v-btn
                  icon
                  density="comfortable"
                  variant="text"
                  color="error"
                  @click="updateApprovalStatus(item.id, 2)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-btn
                  icon
                  density="comfortable"
                  variant="text"
                  color="primary"
                  @click="viewRating(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </div>
            </template>
            <!-- Không có dữ liệu -->
            <template #no-data>
              <v-alert type="info" border="start" text>
                Không có đánh giá nào phù hợp với từ khóa "{{ search }}"
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="650">
  <v-card>
    <v-card-title class="headline font-weight-bold">
      📝 Chi tiết đánh giá
    </v-card-title>

    <v-card-text v-if="selectedRatingDetail">
      <!-- Thông tin đơn hàng -->
      <section class="section-block">
        <h3 class="section-title">📦 Thông tin đơn hàng</h3>
        <div>• Mã đơn hàng: <strong>{{ selectedRatingDetail.order?.id || '—' }}</strong></div>
      </section>

      <!-- Thông tin người đánh giá -->
      <v-divider class="my-3"></v-divider>
      <section class="section-block">
        <h3 class="section-title">👤 Người đánh giá</h3>
        <div>• Họ tên: <strong>{{ selectedRatingDetail.user?.name || '—' }}</strong></div>
        <div>• Email: <strong>{{ selectedRatingDetail.user?.email || '—' }}</strong></div>
        <div>• Số điện thoại: <strong>{{ selectedRatingDetail.order?.phone || '—' }}</strong></div>
      </section>

      <!-- Thông tin sản phẩm -->
      <v-divider class="my-3"></v-divider>
      <section class="section-block">
        <h3 class="section-title">📦 Sản phẩm</h3>
        <div>• Tên sản phẩm: <strong>{{ selectedRatingDetail.product?.name || '—' }}</strong></div>
        <div>• Mã sản phẩm: <strong>{{ selectedRatingDetail.product?.id || '—' }}</strong></div>
      </section>

      <!-- Đánh giá -->
      <v-divider class="my-3"></v-divider>
      <section class="section-block">
        <h3 class="section-title">⭐ Đánh giá</h3>
        <div>• Số sao:
          <v-rating
            v-model="selectedRatingDetail.star_rating"
            color="amber"
            readonly
            size="20"
          ></v-rating>
        </div>
        <div>• Bình luận: <i>{{ selectedRatingDetail.comment || '—' }}</i></div>
      </section>

      <!-- Thông tin khác -->
      <v-divider class="my-3"></v-divider>
      <section class="section-block">
        <h3 class="section-title">📅 Thông tin khác</h3>
        <div>• Ngày đánh giá: <strong>{{ formatDate(selectedRatingDetail.createdAt) }}</strong></div>
        <div>• Trạng thái:
          <strong>
            {{
              selectedRatingDetail.is_approved === 0 ? 'Chờ duyệt' :
              selectedRatingDetail.is_approved === 1 ? 'Đã duyệt' :
              selectedRatingDetail.is_approved === 2 ? 'Từ chối' : 'Không xác định'
            }}
          </strong>
        </div>
      </section>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="dialog = false">Đóng</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar } from '@/composables/useSnackbar'

const { showSnackbar } = useSnackbar()
const search = ref('');
const orders = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const selectedStatus = ref(null);
const selectedRating = ref(null);
const selectedRatingDetail = ref(null);
const dialog = ref(false);


const headers = [
  { title: 'STT', key: 'id', align: 'left', width: '70' },
  { title: 'Thông tin khách hàng', key: 'customerInfo', align: 'left', width: '200' },
  { title: 'Sản phẩm', key: 'product', align: 'left', width: '200' },
  { title: 'Đánh giá', key: 'star_rating', align: 'left', width: '100' },
  { title: 'Bình luận', key: 'comment', align: 'left', width: '150' },
  { title: 'Trạng thái phê duyệt', key: 'status', align: 'left', width: '120' },
  { title: 'Ngày tạo', key: 'createdAt', align: 'left', width: '150' },
  { title: 'Thao tác', key: 'actions', align: 'center', width: '120' }
];

onMounted(fetchOrders);

async function fetchOrders() {
  try {
    const res = await axios.get('http://localhost:3000/rating');
    orders.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch đơn hàng:', err);
    showSnackbar('Lỗi khi tải danh sách đánh giá', 'error');
  }
}
async function updateApprovalStatus(ratingId, status) {
  try {
    await axios.patch(`http://localhost:3000/rating/`, {
      rating_id: ratingId,
      is_approved: status
    });
    await fetchOrders();

    if (status === 2) {
      showSnackbar('Đã từ chối phê duyệt đánh giá!', 'info');
    } else {
      showSnackbar('Cập nhật trạng thái thành công!', 'success');
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái:', err);

    // Lấy message lỗi từ backend nếu có
    const backendMessage = err.response?.data?.message;

    if (backendMessage) {
      showSnackbar(backendMessage, 'error');
    } else {
      showSnackbar('Cập nhật trạng thái thất bại!', 'error');
    }
  }
}

// Lọc theo từ khóa tìm kiếm
const filteredOrders = computed(() => {
  const keyword = search.value.toLowerCase().trim();
  return orders.value.filter(order => {
    const matchSearch =
      (!keyword) ||
      (order.user?.name && order.user?.name.toLowerCase().includes(keyword)) ||
      (order.id && order.id.toLowerCase().includes(keyword)) ||
      (order.user?.phone && order.user?.phone.includes(keyword));

        const matchRating = selectedRating.value === null || order.star_rating === Number(selectedRating.value);
        const matchStatus = selectedStatus.value === null || order.is_approved === Number(selectedStatus.value);


    return matchSearch && matchStatus&&matchRating;
  });
});

// Trạng thái phê duyệt được cập nhật theo selectedRating
const status = computed(() => {
  const filtered = orders.value.filter(o => {
    return selectedRating.value === null || o.star_rating === Number(selectedRating.value);
  });

  const counts = {};
  filtered.forEach(o => {
    if (o.is_approved != null) {
      counts[o.is_approved] = (counts[o.is_approved] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([id, count]) => ({
    id: Number(id),
    name: (Number(id) === 1 
      ? 'Đã duyệt' 
      : Number(id) === 0 
        ? 'Chờ duyệt' 
        : Number(id) === 2 
          ? 'Từ chối' 
          : 'Không xác định') + ` (${count})`
  }));
});

// Số sao được cập nhật theo selectedStatus
const rating = computed(() => {
  const filtered = orders.value.filter(o => {
    return selectedStatus.value === null || o.is_approved === Number(selectedStatus.value);
  });

  const counts = {};
  filtered.forEach(o => {
    if (o.star_rating != null) {
      counts[o.star_rating] = (counts[o.star_rating] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([star, count]) => ({
    id: Number(star),
    name: `${star} sao (${count})`
  }));
});
//xem chi tiết đánh giá
function viewRating(item) {
  selectedRatingDetail.value = item;
  dialog.value = true;
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
.section-block {
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #3f51b5;
}

.v-card-title {
  border-bottom: 1px solid #e0e0e0;
}

.v-card-text div {
  margin-bottom: 4px;
}

</style>
