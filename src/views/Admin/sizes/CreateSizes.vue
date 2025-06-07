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
          <v-form ref="form" v-model="valid" lazy-validation>
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
              :rules="[rules.required]"
              required
            ></v-text-field>

            <!-- Nút Thêm -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :disabled="!valid"
                @click="submitSizes"
              >
                <v-icon start>mdi-plus</v-icon>
                Thêm kích thước
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
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
import sizesService from '@/services/Admin/sizes';

const sizesName = ref('');
const form = ref(null);
const valid = ref(false);
const router = useRouter();

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const rules = {
  required: v => !!v || 'Trường này không được để trống',
};

function showSnackbar(message, color = 'success') {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

async function submitSizes() {
  if (!form.value.validate()) {
    return;
  }

  try {
    const newSizes = { name: sizesName.value };
    await sizesService.createSizes(newSizes);
    showSnackbar('Thêm kích thước thành công!', 'success');
    router.push('/admin/sizes');
  } catch (error) {
    console.error('Lỗi khi thêm kích thước:', error);
    if (error.response) {
      console.error('Chi tiết lỗi từ backend:', error.response.data);
    }
    showSnackbar('Thêm kích thước thất bại!', 'error');
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
