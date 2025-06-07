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
          <v-form>
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
  </v-container>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import brandService from '@/services/Admin/brands'; // đường dẫn điều chỉnh tùy thư mục

const brandName = ref('');
const brandImage = ref(null);
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const oldImage = ref(''); // dùng nếu không cập nhật ảnh mới

// Load dữ liệu hiện tại của brand
onMounted(async () => {
  try {
    const res = await brandService.getBrandsList(); // hoặc gọi /brands/:id nếu API có
    const brand = res.data.data.find(b => b.id === parseInt(id));
    if (brand) {
      brandName.value = brand.name;
      oldImage.value = brand.image;
    }
  } catch (error) {
    console.error('Lỗi khi load thương hiệu:', error);
  }
});

async function submitBrands() {
  const formData = new FormData();
  formData.append('name', brandName.value);
  
  if (brandImage.value) {
    formData.append('image', brandImage.value);
  } else {
    formData.append('image', oldImage.value); // Gửi lại hình cũ nếu không đổi
  }

  try {
    const res = await brandService.updateBrand(id, formData);
    alert('✅ Chỉnh sửa thành công!');
    router.push({ name: 'brandsManagement' });
  } catch (error) {
    console.error(' Lỗi khi cập nhật thương hiệu:', error);
    alert(' Lỗi khi cập nhật thương hiệu.');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
