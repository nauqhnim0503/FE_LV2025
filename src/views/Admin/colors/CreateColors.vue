<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Thêm màu sắc mới</h3>
        </v-card>
      </v-col>

      <!-- Form -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form ref="form" v-model="isFormValid">
            <!-- Tên màu sắc -->
            <v-text-field
              v-model="colorsName"
              label="Tên màu sắc"
              placeholder="Nhập tên màu sắc"
              prepend-inner-icon="mdi-tag"
              variant="solo"
              color="primary"
              rounded-lg
              class="mb-4"
              :rules="colorsNameRules"
              required
            ></v-text-field>

            <!-- Ảnh màu sắc -->
            <v-file-input
              v-model="colorsImage"
              label="Chọn hình ảnh màu sắc"
              accept="image/*"
              variant="solo"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
              :rules="colorsImageRules"
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
                @click="submitColors"
              >
                <v-icon start>mdi-plus</v-icon>
                Thêm màu sắc
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
import colorsService from '@/services/Admin/colors';
import { useSnackbar } from '@/composables/useSnackbar'; // Nếu bạn dùng composable chung

const { showSnackbar } = useSnackbar();

const router = useRouter();
const form = ref(null);
const isFormValid = ref(false);
const loading = ref(false);

const colorsName = ref('');
const colorsImage = ref(null);
const colorsList = ref([]); // Dùng để kiểm tra trùng tên nếu cần
const imagePreview = ref(null);

// Ràng buộc
const colorsNameRules = [
  v => !!v || 'Tên màu sắc là bắt buộc',
  v => v.length >= 2 || 'Tên phải có ít nhất 2 ký tự',
  v => v.length <= 50 || 'Tên tối đa 50 ký tự',
  v => {
    const exists = colorsList.value.some(
      c => c.name.toLowerCase() === v.toLowerCase()
    );
    return !exists || 'Tên màu sắc này đã tồn tại!';
  }
];

const colorsImageRules = [
  v => !!v || 'Vui lòng chọn ảnh màu sắc',
  v => v?.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => v?.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Load danh sách màu để kiểm tra trùng tên
onMounted(async () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  try {
    const res = await colorsService.getColorsList(); // Đảm bảo bạn có API này
    colorsList.value = res.data.data || [];
  } catch (err) {
    console.error('Lỗi khi load danh sách màu sắc:', err);
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
// Gửi dữ liệu
async function submitColors() {
  const isValid = await form.value?.validate();
  if (!isValid.valid) return;

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append('name', colorsName.value);
    formData.append('code', colorsImage.value); // Có thể là `image` nếu backend đặt vậy

    await colorsService.createColors(formData);
    showSnackbar('✅ Thêm màu sắc thành công!', 'success');

    setTimeout(() => {
      router.push('/admin/colors');
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi thêm màu sắc:', error);
    showSnackbar('❌ Thêm màu sắc thất bại!', 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
