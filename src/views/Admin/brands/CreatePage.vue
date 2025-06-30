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
              variant="solo"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
              :rules="brandImageRules"
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
              <v-btn color="primary" size="large" :loading="loading" :disabled="loading" @click="submitBrand">
                <v-icon start>mdi-plus</v-icon>
                Thêm thương hiệu
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import brandService from '@/services/Admin/brands';
import axios from 'axios'
import { useSnackbar,  } from '@/composables/useSnackbar';

const {showSnackbar} = useSnackbar()
const loading = ref(false)

const brandName = ref('');
const brandImage = ref(null);
const imagePreview = ref(null);
const isFormValid = ref(false);
const form = ref(null);
const router = useRouter();
const brands = ref([])


onMounted(async () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  try {
    const res = await axios.get('http://localhost:3000/brands');
    brands.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi fetch brands:', err);
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
// Ràng buộc
const brandNameRules = [
  v => !!v || 'Tên thương hiệu là bắt buộc',
  v => (v && v.length >= 2) || 'Tên phải có ít nhất 2 ký tự',
  v => (v && v.length <= 50) || 'Tên tối đa 50 ký tự',
  v => {
    const exists = brands.value.some(
      (brand) => brand.name.toLowerCase() === v.toLowerCase()
    )
    return !exists || 'Tên thương hiệu này đã tồn tại!'
  }
  
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

  loading.value = true

  try {
    const newBrand = {
      name: brandName.value,
      image: brandImage.value
    };

    await brandService.createBrand(newBrand);
    showSnackbar('Thêm thương hiệu thành công','success');

    setTimeout(() => {
      router.push('/admin/brands');
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi thêm thương hiệu:', error);
    showSnackbar('Đã xảy ra lỗi khi thêm thương hiệu','error')
    ;
  }finally {
    loading.value = false  
  }
}
</script>
