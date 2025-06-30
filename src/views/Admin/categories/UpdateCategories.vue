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

            <!-- Nút Sửa -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :loading="loading"
                :disabled="loading"
                @click="submitCategories"
              >
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
import { useSnackbar } from '@/composables/useSnackbar';

const { showSnackbar } = useSnackbar();
const router = useRouter();
const route = useRoute();
const id = parseInt(route.params.id);

const form = ref(null);
const isFormValid = ref(false);
const loading = ref(false);

const imagePreview = ref(null);
const categoriesName = ref('');
const categoriesImage = ref(null);
const oldImage = ref('');
const categories = ref([]);

// Ràng buộc tên danh mục
const categoriesNameRules = [
  v => !!v || 'Tên danh mục là bắt buộc',
  v => v.length >= 2 || 'Tên phải có ít nhất 2 ký tự',
  v => v.length <= 50 || 'Tên tối đa 50 ký tự',
  v => {
    const duplicate = categories.value.some(
      c => c.id !== id && c.name.toLowerCase() === v.toLowerCase()
    );
    return !duplicate || 'Tên danh mục này đã tồn tại!';
  }
];

// Ràng buộc ảnh danh mục
const categoriesImageRules = [
  v => !v || v.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => !v || v.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Load dữ liệu danh mục hiện tại và danh sách để check trùng
onMounted(async () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  try {
    const res = await categoriesService.getCategoriesList();
    categories.value = res.data.data;
    const category = categories.value.find(c => c.id === id);

    if (category) {
      categoriesName.value = category.name;
      oldImage.value = category.image;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error);
  }
});
// Xử lý thay đổi ảnh
function handleImageChange(file) {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = null;
  }
  if (file && file instanceof File) {
    imagePreview.value = URL.createObjectURL(file);
  }
}
// Gửi cập nhật danh mục
async function submitCategories() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  if (!categoriesImage.value && !oldImage.value) {
    showSnackbar('Vui lòng chọn hình ảnh danh mục!', 'error');
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append('name', categoriesName.value);
  formData.append('image', categoriesImage.value || oldImage.value);

  try {
    await categoriesService.updateCategories(id, formData);
    showSnackbar('✅ Chỉnh sửa danh mục thành công!', 'success');
    setTimeout(() => {
      router.push({ name: 'categoriesManagement' });
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    showSnackbar('❌ Cập nhật danh mục thất bại!', 'error');
  } finally {
    loading.value = false;
  }
}
</script>
