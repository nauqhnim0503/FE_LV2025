<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý màu sắc</h2>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Tìm kiếm màu sắc"
                v-model="search"
                append-icon="mdi-magnify"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn
                color="primary"
                :to="{ name: 'createColors' }"
                prepend-icon="mdi-plus"
              >
                Thêm màu sắc
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="filteredColors"
            item-value="id"
            class="elevation-1 mt-4"
          >
            <!-- Hiển thị ô màu -->
            <template v-slot:item.code="{ item }">
              <v-img
                :src="item.code"
                height="60"
                width="100"
                cover
                class="rounded">
              </v-img>
            </template>

            <!-- Ngày tạo -->
            <template #item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <!-- Thao tác -->
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
                      :to="{ name: 'updateColors', params: { id: item.id } }"
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

            <!-- Không có dữ liệu -->
            <template #no-data>
              <v-alert type="info" border="start" text>
                Không có màu sắc nào phù hợp với từ khóa "{{ search }}"
              </v-alert>
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
          Bạn có chắc chắn muốn xóa màu sắc
          <strong>{{ colorsToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="deleteDialog = false">Hủy</v-btn>
          <v-btn color="error" @click="deleteColors">Xóa</v-btn>
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
const colors = ref([]);
const deleteDialog = ref(false);
const colorsToDelete = ref(null);

// Snackbar setup
const snackbar = ref({
  show: false,
  color: 'success',
  message: ''
});

const headers = [
  { title: 'ID', key: 'id', align: 'left', width: '50' },
  { title: 'Tên màu sắc', key: 'name', align: 'left' },
  { title: 'Mã màu', key: 'code', align: 'left', width: '200' },
  { title: 'Ngày tạo', key: 'createdAt', align: 'left', width: '200' },
  { title: 'Thao tác', key: 'actions', align: 'center', width: '120' }
];

onMounted(fetchColors);

async function fetchColors() {
  try {
    const res = await axios.get('http://localhost:3000/colors');
    colors.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch màu sắc:', err);
    snackbar.value = {
      show: true,
      color: 'error',
      message: 'Lỗi khi tải danh sách màu sắc'
    };
  }
}

const filteredColors = computed(() => {
  return colors.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

function confirmDelete(item) {
  colorsToDelete.value = item;
  deleteDialog.value = true;
}

async function deleteColors() {
  if (!colorsToDelete.value) return;

  try {
    const res = await axios.delete(
      `http://localhost:3000/colors/${colorsToDelete.value.id}`
    );

    if (res.data.success) {
      colors.value = colors.value.filter(c => c.id !== colorsToDelete.value.id);
      snackbar.value = {
        show: true,
        color: 'success',
        message: '✅ Xóa màu sắc thành công!'
      };
    } else {
      snackbar.value = {
        show: true,
        color: 'error',
        message: res.data.message || '❌ Có lỗi xảy ra!'
      };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || '❌ Lỗi máy chủ khi xóa màu sắc!';
    snackbar.value = {
      show: true,
      color: 'error',
      message
    };
  } finally {
    deleteDialog.value = false;
    colorsToDelete.value = null;
  }
}

// Format ngày giờ
function formatDate(dateStr) {
  const date = new Date(dateStr);
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
</style>
