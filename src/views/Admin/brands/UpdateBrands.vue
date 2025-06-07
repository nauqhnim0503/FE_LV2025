<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Chỉnh sửa thương hiệu</h3>
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
            ></v-file-input>

            <!-- Nút Sửa -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn color="primary" size="large" @click="submitBrands">
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
import brandService from '@/services/Admin/brands';

const brandName = ref('');
const brandImage = ref(null);
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

// Ràng buộc tên thương hiệu
const brandNameRules = [
  v => !!v || 'Tên thương hiệu là bắt buộc',
  v => (v && v.length >= 2) || 'Tên phải có ít nhất 2 ký tự',
  v => (v && v.length <= 50) || 'Tên tối đa 50 ký tự',
];

// Ràng buộc ảnh (tùy chọn: chỉ khi có ảnh mới)
const brandImageRules = [
  v => !v || v.type.startsWith('image/') || 'Tập tin phải là hình ảnh',
  v => !v || v.size <= 2 * 1024 * 1024 || 'Dung lượng hình ảnh tối đa 2MB',
];

// Load dữ liệu thương hiệu
onMounted(async () => {
  try {
    const res = await brandService.getBrandsList(); // hoặc gọi getBrand(id)
    const brand = res.data.data.find(b => b.id === parseInt(id));
    if (brand) {
      brandName.value = brand.name;
      oldImage.value = brand.image;
    }
  } catch (error) {
    console.error('Lỗi khi load thương hiệu:', error);
  }
});

// Gửi cập nhật
async function submitBrands() {
  const isValid = await form.value?.validate();
  if (!isValid.valid) return;

  const formData = new FormData();
  formData.append('name', brandName.value);
  if (brandImage.value) {
    formData.append('image', brandImage.value);
  } else {
    formData.append('image', oldImage.value);
  }

  try {
    await brandService.updateBrand(id, formData);
    snackbar.value = {
      show: true,
      message: '✅ Chỉnh sửa thành công!',
      color: 'success'
    };
    setTimeout(() => {
      router.push({ name: 'brandsManagement' });
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi cập nhật thương hiệu:', error);
    snackbar.value = {
      show: true,
      message: '❌ Cập nhật thất bại!',
      color: 'error'
    };
  }
}
</script>

