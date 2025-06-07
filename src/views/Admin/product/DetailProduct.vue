<template>
  <v-container>
    <v-card class="pa-4">
      <h2>Chi tiết sản phẩm: {{ product.name }}</h2>
      <p><strong>Mô tả:</strong> {{ product.description }}</p>
      <p><strong>Giá:</strong> {{ product.price }} VND</p>
      <p><strong>Khuyến mãi:</strong> {{ product.promotional }} VND</p>
      <p><strong>Trạng thái:</strong> 
        <v-chip :color="product.is_active ? 'green' : 'red'" text-color="white">
          {{ product.is_active ? 'Đang bán' : 'Ngừng bán' }}
        </v-chip>
      </p>

      <v-divider class="my-4"></v-divider>

      <!-- Ảnh sản phẩm -->
      <h3>Ảnh sản phẩm</h3>
      <v-row>
        <v-col v-for="img in product.product_image" :key="img.id" cols="4">
          <v-img :src="img.url" aspect-ratio="1" class="rounded"></v-img>
        </v-col>
      </v-row>

      <!-- Biến thể -->
      <v-divider class="my-4"></v-divider>
      <h3>Biến thể</h3>
      <v-chip
        v-for="variant in product.product_variants"
        :key="variant.id"
        color="primary"
        text-color="white"
        class="ma-1"
      >
        {{ variant.sizes?.name || variant.size_id }} /
        {{ variant.colors?.name || variant.color_id }} 
        ({{ variant.stock_quantity }})
      </v-chip>

      <!-- Thương hiệu và danh mục -->
      <v-divider class="my-4"></v-divider>
      <h3>Thương hiệu & Danh mục</h3>
      <p><strong>Thương hiệu:</strong> {{ product.brands?.name }}</p>
      <p><strong>Danh mục:</strong> {{ product.category?.name }}</p>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const product = ref({});

onMounted(async () => {
  const { id } = route.params;

  try {
    const res = await axios.get(`http://localhost:3000/products/${id}`);
    product.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi tải chi tiết sản phẩm:', err);
  }
});
</script>
