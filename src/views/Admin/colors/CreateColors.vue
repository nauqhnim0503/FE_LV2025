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
          <v-form ref="form" v-model="valid" lazy-validation>
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
              :rules="[rules.required]"
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
              :rules="[rules.requiredFile]"
              required
            ></v-file-input>

            <!-- Nút Thêm -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :disabled="!valid"
                @click="submitColors"
              >
                <v-icon start>mdi-plus</v-icon>
                Thêm màu sắc
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar Thông báo -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      top
      right
      elevation="2"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import colorsService from '@/services/Admin/colors'; // điều chỉnh đường dẫn cho đúng

const colorsName = ref('');
const colorsImage = ref(null);
const router = useRouter();

const form = ref(null);
const valid = ref(false);

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

// Hàm hiển thị snackbar
function showSnackbar(message, color = 'success') {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

const rules = {
  required: v => !!v || 'Trường này bắt buộc nhập.',
  requiredFile: v => !!v || 'Bạn phải chọn ảnh màu sắc.'
};

async function submitColors() {
  // validate form
  if (!form.value.validate()) {
    return;
  }

  try {
    const newColors = new FormData();
    newColors.append('name', colorsName.value);
    newColors.append('code', colorsImage.value);

    await colorsService.createColors(newColors);

    showSnackbar('Thêm màu sắc thành công!', 'success');

    // Chuyển trang sau 1.5s để snackbar hiển thị
    setTimeout(() => {
      router.push('/admin/colors');
    }, 1500);

  } catch (error) {
    console.error('Lỗi khi thêm màu sắc:', error);
    if (error.response) {
      console.error('Chi tiết lỗi từ backend:', error.response.data);
    }
    showSnackbar('Thêm màu sắc thất bại!', 'error');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
