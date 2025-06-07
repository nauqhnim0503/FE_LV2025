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

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom right"
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import categoriesService from '@/services/Admin/categories';

const categoriesName = ref('');
const categoriesImage = ref(null);
const oldImage = ref('');
const form = ref(null);
const isFormValid = ref(false);
const router = useRouter();
const route = useRoute();
const id = route.params.id;

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Ràng buộc tên danh mục
const categoriesNameRules = [
  v => !!v || 'Tên danh mục là bắt buộc',
  v => v.length >= 2 || 'Tên phải có ít nhất 2 ký tự',
  v => v.length <= 50 || 'Tên tối đa 50 ký tự'
];

// Ràng buộc ảnh danh mục (chỉ khi người dùng chọn ảnh mới)
const categoriesImageRules = [
  v => !v || v.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => !v || v.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Load danh mục
onMounted(async () => {
  try {
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

// Gửi cập nhật
async function submitCategories() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  // Kiểm tra có ảnh (cũ hoặc mới)
  if (!categoriesImage.value && !oldImage.value) {
    snackbar.value = {
      show: true,
      color: 'error',
      message: 'Vui lòng chọn hình ảnh danh mục!'
    };
    return;
  }

  const formData = new FormData();
  formData.append('name', categoriesName.value);
  if (categoriesImage.value) {
    formData.append('image', categoriesImage.value);
  } else {
    formData.append('image', oldImage.value);
  }

  try {
    await categoriesService.updateCategories(id, formData);
    snackbar.value = {
      show: true,
      message: '✅ Chỉnh sửa danh mục thành công!',
      color: 'success'
    };
    setTimeout(() => {
      router.push({ name: 'categoriesManagement' });
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    snackbar.value = {
      show: true,
      message: '❌ Cập nhật thất bại!',
      color: 'error'
    };
  }
}
</script>
