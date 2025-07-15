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
    <!-- 🖼️ Danh mục -->
<v-row class="mb-6" dense>
  <v-col
    v-for="category in allCategories"
    :key="category.name"
    cols="6"
    sm="3"
    md="2"
  >
    <v-fade-transition>
      <div
        v-show="selectedCategory === 'Tất cả' || category.name === 'Tất cả' || selectedCategory === category.name"
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
    </v-fade-transition>
  </v-col>
</v-row>

<!-- 🏷️ Thương hiệu -->
<h2 class="mb-4 font-weight-bold">Chọn thương hiệu</h2>
<v-row class="mb-6" dense>
  <v-col
    v-for="brand in allBrands"
    :key="brand.name"
    cols="6"
    sm="3"
    md="2"
  >
    <v-fade-transition>
      <div
        v-show="selectedBrand === 'Tất cả' || brand.name === 'Tất cả' || selectedBrand === brand.name"
        class="category-card"
        @click="selectedBrand = brand.name"
      >
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
    </v-fade-transition>
  </v-col>
</v-row>


<!-- 🧾 Danh mục & Thương hiệu đã chọn -->
<v-slide-y-transition>
  <v-row
    v-if="selectedCategory !== 'Tất cả' || selectedBrand !== 'Tất cả'"
    dense
    class="mb-6"
    key="filter-tags">
    <v-col cols="auto" v-if="selectedCategory !== 'Tất cả'">
      <v-chip
        closable
        color="primary"
        class="mr-2"
        @click:close="selectedCategory = 'Tất cả'">
        Danh mục: {{ selectedCategory }}
      </v-chip>
    </v-col>

    <v-col cols="auto" v-if="selectedBrand !== 'Tất cả'">
      <v-chip
        closable
        color="success"
        class="mr-2"
        @click:close="selectedBrand = 'Tất cả'">
        Thương hiệu: {{ selectedBrand }}
      </v-chip>
    </v-col>
  </v-row>
</v-slide-y-transition>


    <!-- 🔢 Tổng sản phẩm -->
    <div class="text-h6 mb-4 font-weight-medium font-title">
      Tổng sản phẩm: {{ products.length }}
    </div>
    <!-- 🎛️ Bộ lọc nâng cao -->
    <v-row class="mb-4 px-4 py-2" align="center" dense>
      <v-col cols="12" md="3">
        <v-text-field
          label="🔍 Tên sản phẩm"
          v-model="searchText"
          dense
          variant="outlined"
          clearable
          rounded/>
      </v-col>
    
      <v-col cols="12" md="2">
        <v-select
          label="Giá"
          :items="['Giá tăng dần', 'Giá giảm dần']"
          v-model="sortOption"
          dense
          variant="outlined"
          rounded/>
      </v-col>
    
      <!--nút lọc  -->
      <v-col cols="12" md="7" class="d-flex justify-end align-center" style="padding-bottom: 23px;">
        <div
          class="text-primary font-weight-medium cursor-pointer"
          @click="drawer = true"
          style="font-size: 14px;"><v-icon size="28">mdi-filter-variant</v-icon>
          Lọc
        </div>
      </v-col>
    </v-row>

    <!-- 🧭 Drawer bên phải để chứa các bộ lọc nâng cao -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      width="300"
      style="background-color: white;">
      <!-- Thanh tiêu đề -->
      <v-toolbar flat class="justify-center">
        <v-toolbar-title
          class="text-subtitle-1 font-weight-medium text-center"
          style="font-size: 16px;">
          Lọc tìm kiếm
        </v-toolbar-title>
      </v-toolbar>
    
      <!-- Nội dung bảng lọc -->
      <v-container class="pb-16">
        
        
<!-- Bộ lọc màu sắc -->
<div class="mb-6">
  <div class="text-subtitle-2 font-weight-medium mb-2">Màu sắc</div>
  <v-row dense>
    <v-col
      v-for="color in allColors"
      :key="color.id"
      cols="6"
      class="d-flex justify-center"
    >
      <v-btn
  size="small"
  :class="['color-btn', selectedColor === color.id ? 'color-btn--active' : '']"
  :style="getColorButtonStyle(color)"
  @click="selectedColor = selectedColor === color.id ? null : color.id"
>
  {{ color.name }}
</v-btn>
    </v-col>
  </v-row>
</div>

      
        <!-- Bộ lọc kích thước -->
        <div class="mb-6">
          <div class="text-subtitle-2 font-weight-medium mb-2">Kích thước</div>
          <v-row dense>
            <v-col
              v-for="size in allSizes"
              :key="size"
              cols="4"
            >
              <v-btn
                block
                variant="outlined"
                size="small"
                :color="selectedSize === size ? 'primary' : ''"
                class="text-none"
                @click="selectedSize = selectedSize === size ? null : size"
              >
                {{ size }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      
        <!-- Bộ lọc giá -->
        <div class="mb-6">
          <div class="text-subtitle-2 font-weight-medium mb-2">Khoảng giá</div>
          <v-btn-toggle
            v-model="selectedPriceRange"
            class="d-flex flex-column"
            mandatory>
            <v-btn
              v-for="(range, index) in priceRanges"
              :key="index"
              :value="index"  
              size="small">
              {{ range.label }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-container>

      <div
        class="d-flex justify-space-between px-4 py-3"
        style="position: absolute; bottom: 0; width: 100%; background: white; border-top: 1px solid #eee;">
        <v-btn
          variant="outlined"
          color="grey"
          size="small"
          class="text-none"
          @click="clearFilters">
          Thiết lập lại
        </v-btn>
      
        <v-btn
          color="primary"
          size="small"
          class="text-none"
          @click="applyFilters">
          Áp dụng
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- 🛍️ Danh sách sản phẩm -->
    <v-row dense>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-3">
        <v-fab-transition>
        <div class="product-wrapper">
          <!-- Dùng router-link bao quanh ảnh -->
          <router-link
            :to="{ name: 'ProductDetail', params: { id: product.id } }"
            class="no-underline">
            <v-card class="product-card" elevation="2">
              <v-img
                :src="product.product_image?.[0]?.url ||'https://via.placeholder.com/200'"
                height="350px"
                cover/>
            </v-card>
          </router-link>

          <!-- Phần thông tin, cũng bao router-link quanh tên -->
          <div class="product-info">
            <router-link
              :to="{ name: 'ProductDetail', params: { id: product.id } }"
              class="text-decoration-none">
              <div class="text-left font-weight-bold text-h6 mb-1 text-black font-title">
                {{ product.name }}
              </div>
            </router-link>
            <div class="text-left font-weight-medium mb-1">
              <!-- Giá bán (có gạch ngang và màu xám nếu có giá khuyến mãi) -->
              <span :class="['original-price', { 'has-discount': product.promotional }]">
                {{ formatPrice(product.price) }}
              </span>
            
              <!-- Giá khuyến mãi (chỉ hiện nếu có) -->
              <span v-if="product.promotional" class="text-error ml-2 font-weight-bold">
                {{ formatPrice(product.promotional) }}
              </span>
            </div>

            <div class="d-flex mt-2">
              <div
                v-for="variant in getUniqueColors(product.product_variants)"
                :key="variant.color_id"
                class="color-dot me-2"
                :style="getColorStyle(variant.colors?.code)"
              ></div>
            </div>
          </div>
        </div>
        </v-fab-transition>
  </v-col>
</v-row>
<v-row justify="center" class="my-6">
  <v-container style="max-width: 100%; overflow-x: auto;">
    <v-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :length="totalPages"
      @update:modelValue="onPageChange"
      color="primary"/>
  </v-container>
</v-row>

<v-row v-if="products.length === 0 && !loading" class="text-center py-10">
  <v-col cols="12">
    <v-icon size="50" color="grey">mdi-emoticon-sad-outline</v-icon>
    <div class="text-subtitle-1 mt-2 font-weight-medium">
      Không tìm thấy sản phẩm phù hợp với từ khóa hoặc bộ lọc đã chọn.
    </div>
  </v-col>
</v-row>

  </v-container>
  <FloatingContact />
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import FloatingContact from '@/components/FloatingContact.vue'

// Các reactive state
const products = ref([])
const selectedCategory = ref('Tất cả')
const selectedBrand = ref('Tất cả')
const sortOption = ref('')
const searchText = ref('')
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
//bảng lọc
const drawer = ref(false)
const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedPriceRange = ref(null)
const debouncedFetch = debounce(() => {
  fetchProducts()
}, 500)
const onPageChange = () => {
  fetchProducts()
}
watch(searchText, debouncedFetch)

const clearFilters = () => {
  sortOption.value = ''
  searchText.value = ''
  selectedCategory.value = 'Tất cả'
  selectedBrand.value = 'Tất cả'
  selectedColor.value = null
  selectedSize.value = null
  selectedPriceRange.value = null
  currentPage.value = 1
  fetchProducts()
}

const allColors = computed(() => {
  const map = new Map()
  products.value.forEach(p => {
    p.product_variants?.forEach(v => {
      if (v.colors && !map.has(v.color_id)) {
        map.set(v.color_id, {
          id: v.color_id,
          name: v.colors.name,
          code: v.colors.code
        })
      }
    })
  })
  return Array.from(map.values())
})

const allSizes = computed(() => {
  const set = new Set()
  products.value.forEach(p => {
    p.product_variants?.forEach(v => {
      if (v.sizes && v.sizes.name) {
        set.add(v.sizes.name)
      }
    })
  })
  return Array.from(set)
})

// Các nhóm khoảng giá
const priceRanges = [
  { label: 'Dưới 500,000₫', min: 0, max: 500000 },
  { label: '500,000₫ - 1,000,000₫', min: 500000, max: 1000000 },
  { label: '1,000,000₫ - 1,500,000₫', min: 1000000, max: 1500000 },
  { label: '2,000,000₫ - 5,000,000₫', min: 2000000, max: 5000000 },
  { label: 'Trên 5,000,000₫', min: 5000000, max: Infinity }
]
const applyFilters = () => {
  currentPage.value = 1
  fetchProducts()
  drawer.value = false
}
// Hàm gọi API với bộ lọc hiện tại
const fetchProducts = async () => {
  loading.value = true
  try {
    const range = (selectedPriceRange.value !== null) ? priceRanges[selectedPriceRange.value] : {}
    const params = {
      page: currentPage.value,
      limit: 8,
      keyword: searchText.value || undefined,
      categoryName: selectedCategory.value !== 'Tất cả' ? selectedCategory.value : undefined,
      brandName: selectedBrand.value !== 'Tất cả' ? selectedBrand.value : undefined,
      sortPrice: sortOption.value === 'Giá tăng dần'
        ? 'asc'
        : sortOption.value === 'Giá giảm dần'
        ? 'desc'
        : undefined,
      minPrice: range.min ?? undefined,
      maxPrice: isFinite(range.max) ? range.max : undefined,
      colorId: selectedColor.value || undefined,
      size: selectedSize.value ? selectedSize.value.trim().toUpperCase() : undefined
    }
    
    const res = await axios.get('http://localhost:3000/productall', { params })
    products.value = res.data.data
    totalPages.value = res.data.pagination?.totalPages || 1
    console.log('Total pages:', totalPages.value)
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error)
  } finally {
    loading.value = false
  }
}

// Gọi API khi lần đầu mounted
onMounted(fetchProducts)

// Tự động gọi lại khi có thay đổi trong các bộ lọc
watch(
  [selectedCategory, selectedBrand, sortOption, searchText],
  fetchProducts
)

// Danh sách danh mục từ dữ liệu trả về
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

// Danh sách thương hiệu từ dữ liệu trả về
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

const getUniqueColors = (variants) => {
  const seen = new Set();
  return variants.filter(v => {
    if (v.colors && !seen.has(v.color_id)) {
      seen.add(v.color_id);
      return true;
    }
    return false;
  });
};
// Format hiển thị màu
const getColorStyle = (code) => ({
  backgroundImage: `url('${code}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 0 0 1px #ddd'
})
const getColorButtonStyle = (color) => ({
  background: `url('${color.code}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '15px',
  minHeight: '30px',
  minWidth: '80px',
  maxWidth: '100px',
  fontSize: '13px',
  color: 'white',
  padding: '4px 8px',
  textShadow: '0 0 2px rgba(0, 0, 0, 0.6)'
})

// Format tiền
const formatPrice = (price) =>
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
.original-price {
  color: #888888; /* Màu xám */
  font-size: 16px;
}

.original-price.has-discount {
  text-decoration: line-through; /* Gạch ngang */
}
.color-btn--active {
  box-shadow: 0 0 10px 3px rgba(0, 123, 255, 0.7);
  border: 2px solid #007bff; /* viền màu xanh dương */
  transform: scale(1.05);
  transition: transform 0.15s ease, box-shadow 0.3s ease, border 0.3s ease;
}

</style>
<style>
/* Font tổng thể */
html, body, #app {
  font-family: 'Playfair Display', serif; /* Font mặc định dễ đọc */
  font-size: 17px;
  line-height: 1.6;
}
.font-title {
  font-family: 'Playfair Display', serif !important;
}
/* Font cho giá tiền */
.price, .original-price, .text-error {
  font-family: 'Inter', sans-serif !important;
  font-size: 17px;
}
</style>


