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
          <v-form>
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
              required
            ></v-text-field>
            
            <!-- Ảnh màu sắc -->
            <v-file-input
              v-model="colorsImage"
              label="Chọn hình ảnh màu sắc"
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
            <v-btn color="primary" size="large" @click="submitColors">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import colorsService from '@/services/Admin/colors'; // đường dẫn điều chỉnh tùy thư mục

const colorsName = ref('');
const colorsImage = ref(null);
const router = useRouter();

async function submitColors() {
  if (!colorsName.value || !colorsImage.value) {
    alert('Vui lòng nhập đầy đủ tên và chọn hình ảnh!');
    return;
  }

  try {
    // Nếu ảnh đã là URL: bạn gán trực tiếp
    const newColors = new FormData();
    newColors.append('name', colorsName.value);
    
    // Giả sử backend multer xử lý file ở field 'code' (hoặc 'image'), bạn sửa cho đúng
    newColors.append('code', colorsImage.value);

    await colorsService.createColors(newColors);
    alert('Thêm màu sắc thành công!');
    router.push('/admin/colors');
  } catch (error) {
    console.error('Lỗi khi thêm màu sắc:', error);
    if (error.response) {
      console.error('Chi tiết lỗi từ backend:', error.response.data);
    }
    alert('Thêm màu sắc thất bại!');
  }
}

</script>


<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
