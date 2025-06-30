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
          <v-form ref="form" v-model="isFormValid" lazy-validation>
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
              :rules="sizesNameRules"
              required
            ></v-text-field>

            <!-- Nút Thêm -->
            <div class="d-flex justify-end rounded-lg">
              <v-btn
                color="primary"
                size="large"
                :loading="loading"
                :disabled="loading"
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import sizesService from '@/services/Admin/sizes';
import { useSnackbar } from '@/composables/useSnackbar';

const { showSnackbar } = useSnackbar();
const router = useRouter();

const form = ref(null);
const isFormValid = ref(false);
const loading = ref(false);

const sizesName = ref('');
const sizesList = ref([]);

// Rules tên kích thước, có check trùng
const sizesNameRules = [
  v => !!v || 'Tên kích thước là bắt buộc',
  v => v.length >= 1 || 'Tên phải có ít nhất 1 ký tự',
  v => v.length <= 50 || 'Tên tối đa 50 ký tự',
  v => {
    const duplicate = sizesList.value.some(s => s.name.toLowerCase() === v.toLowerCase());
    return !duplicate || 'Tên kích thước này đã tồn tại!';
  }
];

// Load danh sách kích thước để check trùng
onMounted(async () => {
  try {
    const res = await sizesService.getSizesList();
    sizesList.value = res.data.data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách kích thước:', error);
  }
});

async function submitSizes() {
  const valid = await form.value?.validate();
  if (!valid.valid) return;

  loading.value = true;
  try {
    await sizesService.createSizes({ name: sizesName.value });
    showSnackbar('✅ Thêm kích thước thành công!', 'success');
    setTimeout(() => router.push('/admin/sizes'), 1500);
  } catch (error) {
    console.error('Lỗi khi thêm kích thước:', error);
    showSnackbar('❌ Thêm kích thước thất bại!', 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>
