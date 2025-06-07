<template>
  <v-container>
    <v-img
      src="https://theme.hstatic.net/1000197303/1001046599/14/collection_banner.jpg?v=16303"
      height="400"
      cover
      class="rounded-lg mb-6"
    />
    <!-- 🖼️ Lọc theo Danh mục bằng ảnh -->
    <h2 class="mb-4 font-weight-bold">Mua sắm theo danh mục</h2>
    <v-row class="mb-6" dense>
      <v-col
        v-for="category in allCategories"
        :key="category.name"
        cols="6"
        sm="3"
        md="2"
      >
        <div class="category-card" @click="selectedCategory = category.name">
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

    <!-- 🏷️ Lọc theo Thương hiệu bằng ảnh -->
    <h2 class="mb-4 font-weight-bold">Chọn thương hiệu</h2>
    <v-row class="mb-6" dense>
      <v-col
        v-for="brand in allBrands"
        :key="brand.name"
        cols="6"
        sm="3"
        md="2"
      >
        <div class="category-card" @click="selectedBrand = brand.name">
          <v-img
            :src="brand.image"
            height="100"
            class="rounded-lg"
            contain
          />
          <div
            class="text-center mt-2 font-weight-medium"
            :class="{
              'text-success': selectedBrand === brand.name,
              'text-black': selectedBrand !== brand.name
            }"
          >
            {{ brand.name }}
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 🔢 Tổng sản phẩm -->
    <div class="text-h6 mb-4 font-weight-medium">
      Tổng sản phẩm: {{ filteredProducts.length }}
    </div>

    <!-- 📸 Banner -->
    

    <!-- 🎛️ Bộ lọc nâng cao -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="3">
        <v-select
          label="Sắp xếp"
          :items="['Giá tăng dần', 'Giá giảm dần']"
          v-model="sortOption"
          dense
          outlined
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          label="Giá từ"
          type="number"
          v-model.number="minPrice"
          dense
          outlined
          :min="0"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          label="Đến"
          type="number"
          v-model.number="maxPrice"
          dense
          outlined
          :min="0"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          label="Tìm kiếm tên sản phẩm"
          v-model="searchText"
          dense
          outlined
          clearable
        />
      </v-col>
    </v-row>

    <!-- 🛍️ Danh sách sản phẩm -->
    <v-row dense>
      <v-col
        v-for="product in sortedAndFilteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-3"
      >
        <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
          <v-card class="product-card" elevation="2">
            <v-img
              :src="product.product_image?.[0]?.url || 'https://via.placeholder.com/200'"
              height="300"
              cover
            />
            <v-card-title class="text-wrap">{{ product.name }}</v-card-title>
            <v-card-subtitle class="text-primary">
              {{ formatPrice(product.price) }}
            </v-card-subtitle>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const products = ref([])
const selectedCategory = ref('Tất cả')
const selectedBrand = ref('Tất cả')
const sortOption = ref('')
const minPrice = ref(0)
const maxPrice = ref(Infinity)
const searchText = ref('')

// Gọi API khi mounted
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/products')
  products.value = res.data.data
})

// Danh mục có hình ảnh
const allCategories = computed(() => {
  const set = new Set()
  return [
    { name: 'Tất cả', image: 'https://theme.hstatic.net/1000197303/1001046599/14/category1-img.png?v=16303' },
    ...products.value
      .filter(p => {
        const name = p.category?.name
        if (!name || set.has(name)) return false
        set.add(name)
        return true
      })
      .map(p => ({
        name: p.category.name,
        image: p.category.image || 'https://via.placeholder.com/200'
      }))
  ]
})

// Thương hiệu có hình ảnh
const allBrands = computed(() => {
  const set = new Set()
  return [
    { name: 'Tất cả', image: 'https://thumbs.dreamstime.com/z/fashion-brands-logos-vector-collection-most-famous-world-eps-file-available-58381201.jpg' },
    ...products.value
      .filter(p => {
        const name = p.brands?.name
        if (!name || set.has(name)) return false
        set.add(name)
        return true
      })
      .map(p => ({
        name: p.brands.name,
        image: p.brands.image || 'https://via.placeholder.com/200'
      }))
  ]
})

// Lọc theo danh mục, thương hiệu, giá, tên
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory =
      selectedCategory.value === 'Tất cả' ||
      p.category?.name === selectedCategory.value

    const matchBrand =
      selectedBrand.value === 'Tất cả' ||
      p.brands?.name === selectedBrand.value

    const matchPrice =
      p.price >= Math.max(minPrice.value, 0) &&
      p.price <= Math.max(maxPrice.value, 0)

    const matchSearch = p.name
      .toLowerCase()
      .includes(searchText.value.toLowerCase())

    return matchCategory && matchBrand && matchPrice && matchSearch
  })
})

// Sắp xếp
const sortedAndFilteredProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  if (sortOption.value === 'Giá tăng dần') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortOption.value === 'Giá giảm dần') {
    sorted.sort((a, b) => b.price - a.price)
  }
  return sorted
})

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
  transition: transform 0.2s ease;
  border-radius: 12px;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
