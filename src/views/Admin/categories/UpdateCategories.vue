<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Chỉnh sửa danh mục</h3>
        </v-card>
      </v-col>

      <!-- Form -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form>
            <!-- Tên danh mục -->
            <v-text-field
              v-model="categoriesName"
              label="Tên danh mục"
              placeholder="Nhập tên danh mục"
              prepend-inner-icon="mdi-tag"
              variant="solo"
              color="primary"
              rounded-lg
              class="mb-4"
              required
            ></v-text-field>

            <!-- Ảnh danh mục -->
            <v-file-input
              v-model="categoriesImage"
              label="Chọn hình ảnh danh mục"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              variant="solo"
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
            ></v-file-input>

            <!-- Nút Sửa -->
             <div class="d-flex justify-end rounded-lg">
            <v-btn color="primary" size="large" @click="submitCategories">
              Chỉnh sửa
            </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import categoriesService from '@/services/Admin/categories';

const categoriesName = ref('');
const categoriesImage = ref(null);
const oldImage = ref('');
const route = useRoute();
const router = useRouter();

const id = route.params.id;

onMounted(async () => {
  try {
    // Giả sử API có hàm getCategoryById
    // const res = await categoriesService.getCategoryById(id);
    // const category = res.data.data;

    // Nếu chưa có API riêng thì lấy danh sách rồi filter
    const res = await categoriesService.getCategoriesList();
    const category = res.data.data.find(b => b.id === parseInt(id));

    if (category) {
      categoriesName.value = category.name;
      oldImage.value = category.image;
    }
  } catch (error) {
    console.error('Lỗi khi load danh mục:', error);
  }
});

async function submitCategories() {
  const formData = new FormData();
  formData.append('name', categoriesName.value);
  
  if (categoriesImage.value) {
    formData.append('image', categoriesImage.value);
  } else {
    formData.append('image', oldImage.value); // Gửi lại hình cũ nếu không đổi
  }

  try {
    const res = await categoriesService.updateCategories(id, formData);
    alert('✅ Chỉnh sửa thành công!');
    router.push({ name: 'categoriesManagement' });
  } catch (error) {
    console.error(' Lỗi khi cập nhật danh mục:', error);
    alert(' Lỗi khi cập nhật danh mục.');
  }
}
</script>


<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
