<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Thêm thương hiệu mới</h3>
        </v-card>
      </v-col>

      <!-- Form -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form ref="form" v-model="isFormValid">
            <!-- Tên thương hiệu -->
            <v-text-field
              v-model="brandName"
              label="Tên thương hiệu"
              placeholder="Nhập tên thương hiệu"
              prepend-inner-icon="mdi-tag"
              variant="solo"
              color="primary"
              rounded-lg
              class="mb-4"
              :rules="brandNameRules"
              required
            ></v-text-field>

            <!-- Ảnh thương hiệu -->
            <v-file-input
              v-model="brandImage"
              label="Chọn hình ảnh thương hiệu"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              variant="solo"
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
              :rules="brandImageRules"
              required
            ></v-file-input>

            <!-- Nút Thêm -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn color="primary" size="large" @click="submitBrand">
                <v-icon start>mdi-plus</v-icon>
                Thêm thương hiệu
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import brandService from '@/services/Admin/brands';

const brandName = ref('');
const brandImage = ref(null);
const isFormValid = ref(false);
const form = ref(null);
const router = useRouter();

// Snackbar thông báo
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Ràng buộc
const brandNameRules = [
  v => !!v || 'Tên thương hiệu là bắt buộc',
  v => (v && v.length >= 2) || 'Tên phải có ít nhất 2 ký tự',
  v => (v && v.length <= 50) || 'Tên tối đa 50 ký tự',
];

const brandImageRules = [
  v => !!v || 'Vui lòng chọn hình ảnh',
  v => !v || v.type.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => !v || v.size <= 2 * 1024 * 1024 || 'Dung lượng hình ảnh tối đa 2MB',
];

// Gửi dữ liệu
async function submitBrand() {
  const isValid = await form.value?.validate();
  if (!isValid.valid) return;

  try {
    const newBrand = {
      name: brandName.value,
      image: brandImage.value
    };

    await brandService.createBrand(newBrand);

    snackbar.value = {
      show: true,
      message: 'Thêm thương hiệu thành công!',
      color: 'success'
    };

    setTimeout(() => {
      router.push('/admin/brands');
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi thêm thương hiệu:', error);
    snackbar.value = {
      show: true,
      message: 'Đã xảy ra lỗi khi thêm thương hiệu!',
      color: 'error'
    };
  }
}
</script>
