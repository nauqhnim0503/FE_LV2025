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

            <!-- Nút Sửa -->
             <div class="d-flex justify-end rounded-lg">
            <v-btn color="primary" size="large" @click="submitColors" >
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
import colorsService from '@/services/Admin/colors'; // đường dẫn điều chỉnh tùy thư mục

const colorsName = ref('');
const colorsImage = ref(null);
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const oldImage = ref(''); // dùng nếu không cập nhật ảnh mới

// Load dữ liệu hiện tại của colors
onMounted(async () => {
  try {
    const res = await colorsService.getColorsList(); // hoặc gọi /colors/:id nếu API có
    const color = res.data.data.find(b => b.id === parseInt(id));
    if (color) {
      colorsName.value = color.name;
      oldImage.value = color.image;
    }
  } catch (error) {
    console.error('Lỗi khi load màu sắc:', error);
  }
});

async function submitColors() {
  const formData = new FormData();
  formData.append('name', colorsName.value);
  
  if (colorsImage.value) {
    formData.append('code', colorsImage.value);
  } else {
    formData.append('code', oldImage.value); // Gửi lại hình cũ nếu không đổi
  }

  try {
    const res = await colorsService.updateColors(id, formData);
    alert('✅ Chỉnh sửa thành công!');
    router.push({ name: 'colorsManagement' });
  } catch (error) {
    console.error(' Lỗi khi cập nhật màu sắc:', error);
    alert(' Lỗi khi cập nhật màu sắc.');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
