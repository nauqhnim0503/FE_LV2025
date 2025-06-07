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
          <v-form ref="form" v-model="isFormValid">
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
              :rules="categoriesNameRules"
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
              :rules="categoriesImageRules"
              required
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

    <!-- Snackbar thông báo -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      timeout="3000"
      rounded="lg"
    >
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import categoriesService from '@/services/Admin/categories';

const categoriesName = ref('');
const categoriesImage = ref(null);
const form = ref(null);
const isFormValid = ref(false);
const router = useRouter();

// Snackbar hiển thị thông báo
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Ràng buộc tên danh mục
const categoriesNameRules = [
  v => !!v || 'Tên danh mục là bắt buộc',
  v => (v && v.length >= 2) || 'Tên phải có ít nhất 2 ký tự',
  v => (v && v.length <= 50) || 'Tên tối đa 50 ký tự'
];

// Ràng buộc ảnh danh mục
const categoriesImageRules = [
  v => !!v || 'Vui lòng chọn hình ảnh',
  v => v?.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => v?.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Hàm submit
async function submitCategories() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  try {
    const newCategories = {
      name: categoriesName.value,
      image: categoriesImage.value
    };

    await categoriesService.createCategories(newCategories);

    snackbar.value = {
      show: true,
      color: 'success',
      message: '✅ Thêm danh mục thành công!'
    };

    setTimeout(() => {
      router.push('/admin/categories');
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error);
    snackbar.value = {
      show: true,
      color: 'error',
      message: '❌ Thêm danh mục thất bại!'
    };
  }
}
</script>
