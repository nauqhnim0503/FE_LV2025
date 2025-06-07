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
              label="Chọn hình ảnh màu sắc (nếu muốn đổi)"
              accept="image/*"
              prepend-inner-icon="mdi-image"
              prepend-icon=""
              variant="solo"
              color="primary"
              rounded-lg
              show-size
              class="mb-6"
              :rules="[rules.optionalFile]"
            ></v-file-input>

            <!-- Nút Sửa -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :disabled="!valid"
                @click="submitColors"
              >
                Chỉnh sửa
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import colorsService from '@/services/Admin/colors'; // điều chỉnh đường dẫn cho đúng

const colorsName = ref('');
const colorsImage = ref(null);
const oldImage = ref('');
const route = useRoute();
const router = useRouter();
const id = route.params.id;

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
  // Ảnh file có thể để trống, hoặc nếu có thì phải là file ảnh
  optionalFile: v => {
    if (!v) return true; // không bắt buộc
    // Kiểm tra file có phải là ảnh không (dựa vào type)
    if (v && v.type && v.type.startsWith('image/')) return true;
    return 'File phải là hình ảnh.';
  }
};

// Load dữ liệu hiện tại của màu sắc
onMounted(async () => {
  try {
    const res = await colorsService.getColorsList(); // hoặc gọi /colors/:id nếu API có
    const color = res.data.data.find(b => b.id === parseInt(id));
    if (color) {
      colorsName.value = color.name;
      oldImage.value = color.code || color.image || ''; // tên field tùy backend
    }
  } catch (error) {
    console.error('Lỗi khi load màu sắc:', error);
    showSnackbar('Lỗi khi tải dữ liệu màu sắc.', 'error');
  }
});

async function submitColors() {
  if (!form.value.validate()) {
    return;
  }

  const formData = new FormData();
  formData.append('name', colorsName.value);

  if (colorsImage.value) {
    formData.append('code', colorsImage.value);
  } else {
    formData.append('code', oldImage.value);
  }

  try {
    await colorsService.updateColors(id, formData);
    showSnackbar('✅ Chỉnh sửa thành công!', 'success');
    setTimeout(() => {
      router.push({ name: 'colorsManagement' });
    }, 1500);
  } catch (error) {
    console.error('Lỗi khi cập nhật màu sắc:', error);
    showSnackbar('Lỗi khi cập nhật màu sắc.', 'error');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
