<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Thêm kích thước mới</h3>
        </v-card>
      </v-col>

      <!-- Form -->
      <v-col cols="12">
        <v-card class="pa-6 elevation-3 rounded-lg">
          <v-form>
            <!-- Tên kích thước -->
            <v-text-field
              v-model="sizesName"
              label="Tên kích thước"
              placeholder="Nhập tên kích thước"
              prepend-inner-icon="mdi-tag"
              variant="solo"
              color="primary"
              rounded-lg
              class="mb-4"
              required
            ></v-text-field>

            <!-- Nút Thêm -->
             <div class="d-flex justify-end rounded-lg">
            <v-btn color="primary" size="large" @click="submitSizes">
              <v-icon start>mdi-plus</v-icon>
              Thêm kích thước
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
import sizesService from '@/services/Admin/sizes'; // đường dẫn điều chỉnh tùy thư mục

const sizesName = ref('');
const router = useRouter();

async function submitSizes() {
  if (!sizesName.value) {
    alert('Vui lòng nhập đầy đủ tên !');
    return;
  }

  try {
    const newSizes = { name: sizesName.value }; // Gửi object JSON bình thường

    await sizesService.createSizes(newSizes); // đảm bảo createSizes gửi JSON
    alert('Thêm kích thước thành công!');
    router.push('/admin/sizes');
  } catch (error) {
    console.error('Lỗi khi thêm kích thước:', error);
    if (error.response) {
      console.error('Chi tiết lỗi từ backend:', error.response.data);
    }
    alert('Thêm kích thước thất bại!');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
