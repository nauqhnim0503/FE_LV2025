<template>
  <v-container>
    <!-- 🖼️ Mua sắm theo danh mục -->
    <h2 class="mb-4 font-weight-bold">Mua sắm theo danh mục</h2>
    <v-row class="mb-6" dense>
      <v-col
        v-for="category in allCategories"
        :key="category.name"
        cols="6"
        sm="3"
        md="2"
      >
        <div
          class="category-card"
          @click="selectedCategory = category.name"
        >
          <v-img
            :src="category.image"
            height="100"
            class="rounded-lg"
            contain
          />
          <div
            class="text-center mt-2 font-weight-medium"
            :class="{
              'text-primary': selectedCategory === category.name,
              'text-black': selectedCategory !== category.name
            }"
          >
            {{ category.name }}
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 🛒 Danh sách sản phẩm -->
    <h2 class="mb-4 font-weight-bold">Sản phẩm nổi bật</h2>
    <v-row dense>
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-3"
        >
  <div class="product-wrapper">
    <!-- Dùng router-link bao quanh ảnh -->
    <router-link
      :to="{ name: 'ProductDetail', params: { id: product.id } }"
      class="no-underline"
    >
      <v-card class="product-card" elevation="2">
        <v-img
          :src="product.product_image?.[0]?.url || 'https://via.placeholder.com/200'"
          height="350px"
          cover
        />
      </v-card>
    </router-link>

    <!-- Phần thông tin, cũng bao router-link quanh tên -->
    <div class="product-info">
      <router-link
        :to="{ name: 'ProductDetail', params: { id: product.id } }"
        class="text-decoration-none"
      >
        <div class="text-left font-weight-bold text-h6 mb-1 text-black">
          {{ product.name }}
        </div>
      </router-link>
      <div class="text-left text-primary font-weight-medium mb-1">
        {{ formatPrice(product.price) }}
      </div>
      <div class="text-left text-caption text-grey-darken-1">
        Thương hiệu: {{ product.brands?.name || 'Không có' }}
      </div>
    </div>
  </div>
</v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const categories = ref([])
const selectedCategory = ref('Tất cả')

// Gọi API lấy sản phẩm và danh mục
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data.data

    // Lấy danh mục duy nhất từ danh sách sản phẩm
    const uniqueCategories = new Set(
      res.data.data.map(p => p.category?.name).filter(Boolean)
    )
    categories.value = [...uniqueCategories].map(name => {
      const found = res.data.data.find(p => p.category?.name === name)
      return {
        name,
        image: found?.category?.image || 'https://via.placeholder.com/200'
      }
    })
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
  }
})

// Danh mục có thêm "Tất cả"
const allCategories = computed(() => [
  { name: 'Tất cả', image: 'https://theme.hstatic.net/1000197303/1001046599/14/category1-img.png?v=16282' },
  ...categories.value
])

// Lọc sản phẩm theo danh mục
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Tất cả') return products.value
  return products.value.filter(
    p => p.category?.name === selectedCategory.value
  )
})

// Format giá VND
const formatPrice = price =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
</script>

<style scoped>
.category-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.category-card:hover {
  transform: scale(1.03);
}
.product-card {
  overflow: hidden;
  border-radius: 10px;
}
.product-card:hover {
  transform: translateY(-4px);
  transition: 0.3s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.product-wrapper {
  display: flex;
  flex-direction: column;
}

.product-info {
  padding-left: 3px; /* bằng với padding bên trong v-card hoặc v-img nếu có */
  padding-top: 8px;
}

</style>
