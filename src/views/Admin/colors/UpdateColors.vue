<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Chỉnh sửa màu sắc</h3>
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

            <!-- Nút Sửa -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :loading="loading"
                :disabled="loading"
                @click="submitColors"
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
import colorsService from '@/services/Admin/colors';
import { useSnackbar } from '@/composables/useSnackbar';

const { showSnackbar } = useSnackbar();
const router = useRouter();
const route = useRoute();
const id = parseInt(route.params.id);

const form = ref(null);
const isFormValid = ref(false);
const loading = ref(false);

const colorsName = ref('');
const colorsImage = ref(null);
const oldImage = ref('');
const colorsList = ref([]);
const imagePreview = ref(null);

// Rules cho tên màu sắc
const colorsNameRules = [
  v => !!v || 'Tên màu sắc là bắt buộc',
  v => v.length >= 2 || 'Tên phải có ít nhất 2 ký tự',
  v => v.length <= 50 || 'Tên tối đa 50 ký tự',
  v => {
    const duplicate = colorsList.value.some(
      c => c.id !== id && c.name.toLowerCase() === v.toLowerCase()
    );
    return !duplicate || 'Tên màu sắc đã tồn tại!';
  }
];

// Rules cho ảnh màu sắc
const colorsImageRules = [
  v => !v || v.type?.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => !v || v.size <= 2 * 1024 * 1024 || 'Dung lượng ảnh tối đa 2MB'
];

// Load dữ liệu màu sắc hiện tại và danh sách để check trùng tên
onMounted(async () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  try {
    const res = await colorsService.getColorsList();
    colorsList.value = res.data.data || [];
    const color = colorsList.value.find(c => c.id === id);

    if (color) {
      colorsName.value = color.name;
      oldImage.value = color.code || color.image || '';
    }
  } catch (error) {
    console.error('Lỗi khi tải màu sắc:', error);
    showSnackbar('Lỗi khi tải dữ liệu màu sắc.', 'error');
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
async function submitColors() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  if (!colorsImage.value && !oldImage.value) {
    showSnackbar('Vui lòng chọn hình ảnh màu sắc!', 'error');
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append('name', colorsName.value);
  formData.append('code', colorsImage.value || oldImage.value);

  try {
    await colorsService.updateColors(id, formData);
    showSnackbar('✅ Chỉnh sửa màu sắc thành công!', 'success');
    setTimeout(() => router.push({ name: 'colorsManagement' }), 1500);
  } catch (error) {
    console.error('Lỗi khi cập nhật màu sắc:', error);
    showSnackbar('❌ Cập nhật màu sắc thất bại!', 'error');
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
