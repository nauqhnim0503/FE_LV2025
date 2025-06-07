<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="mb-0">Quản lý danh mục</h2>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Tìm kiếm danh mục"
                v-model="search"
                append-icon="mdi-magnify"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn
                color="primary"
                :to="{ name: 'createCategories' }"
                prepend-icon="mdi-plus">
                Thêm danh mục
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="filteredCategories"
            item-value="id"
            class="elevation-1 mt-4">
            <template v-slot:item.image="{ item }">
              <v-img
                :src="item.image"
                height="60"
                width="100"
                cover
                class="rounded">
              </v-img>
            </template>
            
            <!-- định dạng ngày giờ -->
            <template #[`item.createdAt`]="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

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
                  :to="{ name: 'updateCategories',params: { id: item.id } }">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa danh mục" location="top">
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
      Bạn có chắc chắn muốn xóa danh mục
      <strong>{{ categoriesToDelete?.name }}</strong>?
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn text @click="deleteDialog = false">Hủy</v-btn>
      <v-btn color="error" @click="deleteCategories">Xóa</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const search = ref('');
const categories = ref([]);
const router = useRouter();
const deleteDialog = ref(false);
const categoriesToDelete = ref(null);

function confirmDelete(item) {
  categoriesToDelete.value = item;
  deleteDialog.value = true;
}

const headers = [
  { title: 'ID', key: 'id',align:'left',width:'50' },
  { title: 'Tên danh mục', key: 'name',align:'left'},
  { title: 'Hình ảnh', key: 'image',align:'left',width:'200' },
  { title: 'Ngày tạo', key: 'createdAt',align:'left',width:'200' },
  { title: 'Thao tác', key: 'actions',align:'center',width:'120' }
];

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/categories');
    categories.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch danh mục:', err);
  }
});

const filteredCategories = computed(() => {
  return categories.value.filter(b =>
    b.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

async function deleteCategories() {
  try {
    const res = await axios.delete(`http://localhost:3000/categories/${categoriesToDelete.value.id}`);
    
    if (res.data.success) {
      categories.value = categories.value.filter(b => b.id !== categoriesToDelete.value.id);
      alert('Xóa danh mục thành công');
    } else {
      alert(res.data.message || 'Có lỗi xảy ra');
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message);
    } else {
      alert('Lỗi máy chủ khi xóa danh mục');
    }
  } finally {
    deleteDialog.value = false;
  }
}
//định dạng ngày giờ
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

</style>
