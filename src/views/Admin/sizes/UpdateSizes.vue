<template>
  <v-container fluid>
    <v-row>
      <!-- Tiêu đề -->
      <v-col cols="12">
        <v-card class="pa-4 rounded-lg">
          <h3 class="mb-0 text-h5 font-weight-bold">Chỉnh sửa kích thước</h3>
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

            <!-- Nút Sửa -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn color="primary" size="large" @click="submitSizes">
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
import sizesService from '@/services/Admin/sizes'; // Đường dẫn service của bạn

const sizesName = ref('');
const route = useRoute();
const router = useRouter();
const id = route.params.id;

onMounted(async () => {
  try {
    const res = await sizesService.getSizesList();
    const size = res.data.data.find(s => s.id === parseInt(id));
    if (size) {
      sizesName.value = size.name;
    } else {
      alert('Không tìm thấy kích thước!');
    }
  } catch (error) {
    console.error('Lỗi khi load kích thước:', error);
    alert('Không thể tải thông tin kích thước');
  }
});

async function submitSizes() {
  try {
    const updatedSize = { name: sizesName.value };
    await sizesService.updateSizes(id, updatedSize);
    alert('Cập nhật thành công!');
    router.push('/admin/sizes');
  } catch (error) {
    console.error('Lỗi khi cập nhật kích thước:', error);
    alert('Cập nhật thất bại!');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
