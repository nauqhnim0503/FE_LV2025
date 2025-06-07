<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý kích thước</h2>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Tìm kiếm kích thước"
                v-model="search"
                append-icon="mdi-magnify"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn
                color="primary"
                :to="{ name: 'createSizes' }"
                prepend-icon="mdi-plus">
                Thêm kích thước
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="filteredSizes"
            item-value="id"
            class="elevation-1 mt-4">
            
            <!-- định dạng ngày giờ -->
            

            <!-- Thao tác với nút sửa -->
            <template #[`item.actions`]="{ item }">
            <div class="d-flex justify-center gap-2">
            <v-tooltip text="Chỉnh sửa" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  density="comfortable"
                  variant="text"
                  color="primary"
                  :to="{ name: 'updateSizes',params: { id: item.id } }"
                  >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa kích thước" location="top">
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
          </div>
          </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="deleteDialog" max-width="400">
  <v-card>
    <v-card-title class="text-h6">Xác nhận xóa</v-card-title>
    <v-card-text>
      Bạn có chắc chắn muốn xóa kích thước này
      <strong>{{ sizesToDelete?.name }}</strong>?
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn text @click="deleteDialog = false">Hủy</v-btn>
      <v-btn color="error" @click="deleteSizes">Xóa</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const search = ref('');
const sizes = ref([]);
const router = useRouter();
const deleteDialog = ref(false);
const sizesToDelete = ref(null);

function confirmDelete(item) {
  sizesToDelete.value = item;
  deleteDialog.value = true;
}

const headers = [
  { title: 'ID', key: 'id', align: 'left', width: '50' },
  { title: 'Tên kích thước', key: 'name', align: 'left', width: '150' },
  { title: 'Thao tác', key: 'actions', align: 'center', width: '120' }
];

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/sizes');
    sizes.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch kích thước:', err);
  }
});

const filteredSizes = computed(() => {
  return sizes.value.filter(size =>
    (size.name || '').toLowerCase().includes((search.value || '').toLowerCase())
  );
});
async function deleteSizes() {
  try {
    const res = await axios.delete(`http://localhost:3000/sizes/${sizesToDelete.value.id}`);
    
    if (res.data.success) {
      sizes.value = sizes.value.filter(b => b.id !== sizesToDelete.value.id);
      alert('Xóa kích thước thành công');
    } else {
      alert(res.data.message || 'Có lỗi xảy ra');
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message);
    } else {
      alert('Lỗi máy chủ khi xóa kích thước');
    }
  } finally {
    deleteDialog.value = false;
  }
}
</script>



<style scoped>
.text-right {
  text-align: right;
}

</style>
