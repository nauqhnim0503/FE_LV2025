<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý mã giảm giá</h2>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Tìm kiếm mã giảm giá"
                v-model="search"
                append-icon="mdi-magnify"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn
                color="primary"
                :to="{ name: 'createDiscount' }"
                prepend-icon="mdi-plus">
                Thêm mã giảm giá
              </v-btn>
            </v-col>
          </v-row>

          <!-- Bảng dữ liệu -->
          <v-data-table
            :headers="headers"
            :items="filteredDiscounts"
            item-value="id"
            class="elevation-1 mt-4"
            :no-data-text="`Không có mã giảm nào phù hợp với từ khóa '${search}'`">
            <template #item.code="{ item }">
              <div>
                <div>{{ item.code }}</div>
                <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
                  Giảm
                  <template v-if="item.discount_type === 'percent'">
                    {{ item.discount_value }}%
                  </template>
                  <template v-else>
                    {{ formatCurrency(item.discount_value) }}
                  </template>
                  | Tối thiểu: {{ formatCurrency(item.min_order_value) }}
                </div>
              </div>
            </template>
            <template #item.discount_type="{ item }">
              <v-chip color="primary" >
                <template v-if="item.discount_type === 'percent'">
                  {{ item.discount_value }}%
                </template>
                <template v-else>
                  {{ formatCurrency(item.discount_value) }}
                </template>
              </v-chip>
            </template>
            <template #item.min_order_value="{ item }">
              {{ formatCurrency(item.min_order_value) }}
            </template>
            <template #item.usage_summary="{ item }">
              <span :class="{ 'text-error': item.used_count >= item.usage_limit }">
                {{ Math.min(item.used_count || 0, item.usage_limit ?? Infinity) }}/{{ item.usage_limit ?? '∞' }}
              </span>
            </template>
            <template #item.duration="{ item }">
              {{ formatDate(item.start_date) }} → {{ formatDate(item.end_date) }}
            </template>
            <template #item.is_active="{ item }">
              <v-chip :color="getStatusColor(item)" dark>
                {{ getStatusText(item) }}
              </v-chip>
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex justify-center align-center gap-2">
                <!-- Nút chỉnh sửa -->
                <v-tooltip text="Chỉnh sửa" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      :to="{ name: 'updateDiscount', params: { id: item.id } }"
                      density="comfortable"
                      variant="text"
                      color="primary">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              
                <!-- Nút xóa -->
                <v-tooltip text="Xóa mã giảm giá" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      density="comfortable"
                      variant="text"
                      color="error"
                      @click="confirmDelete(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              
                <!-- Nút v-switch điều chỉnh trạng thái -->
                <v-tooltip text="Bật/Tắt mã" location="top">
                  <template #activator="{ props }">
                    <div v-bind="props">
                      <v-switch
                        v-model="item.is_active"
                        :true-value="1"
                        :false-value="0"
                        color="green"
                        hide-details
                        density="compact"
                        @change="toggleActiveStatus(item)"
                        :disabled="new Date(item.end_date) < new Date()" >
                      </v-switch>
                    </div>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog xác nhận xóa -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Xác nhận xóa</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn xóa mã giảm giá
          <strong>{{ discountToDelete?.code }}</strong>?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="deleteDialog = false">Hủy</v-btn>
          <v-btn color="error" @click="deleteDiscount">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn icon @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const search = ref('');
const discounts = ref([]);
const deleteDialog = ref(false);
const discountToDelete = ref(null);

const snackbar = ref({
  show: false,
  color: 'success',
  message: ''
});

const headers = [
  { title: 'STT', key: 'id', align: 'left', width: '50' },
  { title: 'Mã giảm giá', key: 'code', align: 'left' },
  { title: 'Loại giảm', key: 'discount_type', align: 'left', width: '150' },
  { title: 'Giá trị tối thiểu', key: 'min_order_value', align: 'left' },
  { title: 'Lượt sử dụng', key: 'usage_summary', align: 'center' },
  { title: 'Thời gian diễn ra', key: 'duration', align: 'center', width: '250' },
  { title: 'Trạng thái', key: 'is_active', align: 'center' },
  { title: 'Thao tác', key: 'actions', align: 'center' }
];

onMounted(fetchDiscounts);

async function fetchDiscounts() {
  try {
    const res = await axios.get('http://localhost:3000/discount_codes');
    const now = new Date();

    // Cập nhật trạng thái is_active nếu cần
    const updatedDiscounts = await Promise.all(
      res.data.data.map(async discount => {
        const isExpired = new Date(discount.end_date) < now;

        const result = {
          ...discount,
          is_active: Number(discount.is_active) 
        };

        // Nếu đã hết hạn nhưng DB chưa cập nhật
        if (isExpired && result.is_active !== 0) {
          try {
            await axios.patch(`http://localhost:3000/discount_codes/${discount.id}`, {
              is_active: 0
            });
            result.is_active = 0; // Cập nhật local
          } catch (e) {
            console.warn(`❌ Lỗi cập nhật is_active cho mã ${discount.code}`);
          }
        }

        return result;
      })
    );

    discounts.value = updatedDiscounts;
  } catch (err) {
    snackbar.value = {
      show: true,
      color: 'error',
      message: '❌ Lỗi khi tải danh sách mã giảm giá'
    };
  }
}


const filteredDiscounts = computed(() => {
  return discounts.value.filter(discount =>
    discount.code.toLowerCase().includes(search.value.toLowerCase())
  );
});

function confirmDelete(item) {
  discountToDelete.value = item;
  deleteDialog.value = true;
}

async function deleteDiscount() {
  if (!discountToDelete.value) return;

  try {
    const res = await axios.delete(
      `http://localhost:3000/discount_codes/${discountToDelete.value.id}`
    );

    if (res.data.success) {
      discounts.value = discounts.value.filter(
        d => d.id !== discountToDelete.value.id
      );
      snackbar.value = {
        show: true,
        color: 'success',
        message: '✅ Đã xóa mã giảm giá thành công!'
      };
    } else {
      snackbar.value = {
        show: true,
        color: 'error',
        message: res.data.message || '❌ Có lỗi xảy ra!'
      };
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      color: 'error',
      message:
        error.response?.data?.message || '❌ Lỗi máy chủ khi xóa mã giảm giá!'
    };
  } finally {
    deleteDialog.value = false;
    discountToDelete.value = null;
  }
}

async function toggleActiveStatus(item) {
  try {
    await axios.patch(`http://localhost:3000/discount_codes/${item.id}`, {
      is_active: item.is_active
    });
    snackbar.value = {
      show: true,
      color: 'success',
      message: `✅ Trạng thái của mã ${item.code} đã được cập nhật!`
    };
  } catch (error) {
    // rollback UI nếu lỗi
    item.is_active = item.is_active ? 0 : 1;
    snackbar.value = {
      show: true,
      color: 'error',
      message: error.response?.data?.message || `❌ Không thể cập nhật trạng thái mã ${item.code}`
    };
  }
}
function getStatusText(item) {
  const now = new Date();
  const end = new Date(item.end_date);

  if (end < now) return 'Đã kết thúc';
  return item.is_active ? 'Đang diễn ra' : 'Không kích hoạt';
}

function getStatusColor(item) {
  const now = new Date();
  const end = new Date(item.end_date);

  if (end < now) return 'red';
  return item.is_active ? 'green' : 'grey';
}
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
.text-error {
  color: red;
  font-weight: bold;
}

</style>
