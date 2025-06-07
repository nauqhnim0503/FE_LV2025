<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Thêm danh mục mới</h3>
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

            <!-- Nút Thêm -->
             <div class="d-flex justify-end rounded-lg">
            <v-btn color="primary" size="large" @click="submitCategories">
              <v-icon start>mdi-plus</v-icon>
              Thêm danh mục
            </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import categoriesService from '@/services/Admin/categories'; // đường dẫn điều chỉnh tùy thư mục

const categoriesName = ref('');
const categoriesImage = ref(null);
const router = useRouter();

async function submitCategories() {
  if (!categoriesName.value || !categoriesImage.value) {
    alert('Vui lòng nhập đầy đủ tên và chọn hình ảnh!');
    return;
  }

  try {
    // Nếu ảnh đã là URL: bạn gán trực tiếp
    const newCategories = {
      name: categoriesName.value,
      image: categoriesImage.value, // Nếu upload, thì xử lý upload trước
    };

    await categoriesService.createCategories(newCategories);
    alert('Thêm danh mục thành công!');
    router.push('/admin/categories');
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error);
    alert('Thêm danh mục thất bại!');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
