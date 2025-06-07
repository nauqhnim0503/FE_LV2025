<template>
  <div>
    <h1>Danh sách thương hiệu</h1>
    <table border="1" cellpadding="10" cellspacing="0">
      <tr>
        <th>Mã</th>
        <th>Tên thương hiệu</th>
        <th>hình ảnh</th>
      </tr>
      <tr v-for="brand in brands" :key="brand.id">
        <td>{{ brand.id }}</td>
        <td>{{ brand.name }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import getBrands from '../services/Admin/brands'

const brands = ref([]);

onMounted(async () => {
  try {
    const res = await getBrands.getBrandsList();
    console.log('Dữ liệu trả về:', res.data.data);
    brands.value = res.data.data; 
  } catch (err) {
    console.error('Lỗi khi fetch brands:', err);
  }
});

</script>
