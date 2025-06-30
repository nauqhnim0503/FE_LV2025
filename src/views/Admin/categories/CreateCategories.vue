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
              variant="solo"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
              :rules="categoriesImageRules"
              required
              @update:model-value="handleImageChange">
              <template #selection="{ fileNames }">
                <div class="d-flex align-center">
                  <v-img
                    v-if="imagePreview"
                    :src="imagePreview"
                    width="80"
                    height="100"
                    class="mr-3 rounded"
                    cover>
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular indeterminate color="grey lighten-2" />
                      </div>
                    </template>
                  </v-img>
                  <span>{{ fileNames.length ? fileNames[0] : 'Chưa chọn file' }}</span>
                </div>
              </template>
            </v-file-input>

            <!-- Nút Thêm -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :loading="loading"
                :disabled="loading"
                @click="submitCategories"
              >
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import categoriesService from '@/services/Admin/categories';
import axios from 'axios';
import { useSnackbar } from '@/composables/useSnackbar';

const { showSnackbar } = useSnackbar();
const loading = ref(false);

const categoriesName = ref('');
const categoriesImage = ref(null);
const imagePreview = ref(null);
const form = ref(null);
const isFormValid = ref(false);
const router = useRouter();
const categories = ref([]);

// Lấy danh sách danh mục để kiểm tra trùng
onMounted(async () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  try {
    const res = await axios.get('http://localhost:3000/categories');
    categories.value = res.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
  }
});
function handleImageChange(file) {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = null;
  }
  if (file && file instanceof File) {
    imagePreview.value = URL.createObjectURL(file);
  }
}
// Ràng buộc tên danh mục
const categoriesNameRules = [
  v => !!v || 'Tên danh mục là bắt buộc',
  v => (v && v.length >= 2) || 'Tên phải có ít nhất 2 ký tự',
  v => (v && v.length <= 50) || 'Tên tối đa 50 ký tự',
  v => {
    const exists = categories.value.some(
      (cat) => cat.name.toLowerCase() === v.toLowerCase()
    );
    return !exists || 'Tên danh mục đã tồn tại!';
  }
];

// Ràng buộc ảnh danh mục
const categoriesImageRules = [
  v => !!v || 'Vui lòng chọn hình ảnh',
  v => v?.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => v?.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Submit danh mục
async function submitCategories() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  loading.value = true;

  try {
    const newCategories = {
      name: categoriesName.value,
      image: categoriesImage.value
    };

    await categoriesService.createCategories(newCategories);

    showSnackbar('✅ Thêm danh mục thành công!', 'success');

    setTimeout(() => {
      router.push('/admin/categories');
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error);
    showSnackbar('❌ Thêm danh mục thất bại!', 'error');
  } finally {
    loading.value = false;
  }
}
</script>
