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
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import brandService from '@/services/Admin/brands'; // đường dẫn điều chỉnh tùy thư mục

const brandName = ref('');
const brandImage = ref(null);
const router = useRouter();

async function submitBrand() {
  if (!brandName.value || !brandImage.value) {
    alert('Vui lòng nhập đầy đủ tên và chọn hình ảnh!');
    return;
  }

  try {
    // Nếu ảnh đã là URL: bạn gán trực tiếp
    const newBrand = {
      name: brandName.value,
      image: brandImage.value, // Nếu upload, thì xử lý upload trước
    };

    await brandService.createBrand(newBrand);
    alert('Thêm thương hiệu thành công!');
    router.push('/admin/brands');
  } catch (error) {
    console.error('Lỗi khi thêm thương hiệu:', error);
    alert('Thêm thương hiệu thất bại!');
  }
}

</script>


<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
