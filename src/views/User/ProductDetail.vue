<template>
  <v-container>
    <v-row>
      <!-- Hình ảnh sản phẩm -->
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="3">
            <v-img
              v-for="(img, index) in product.product_image"
              :key="index"
              :src="img.url"
              aspect-ratio="1"
              class="mb-2"
              @click="selectedImage = img.url"
              style="cursor: pointer; border: 1px solid #ddd; border-radius: 4px"
            />
          </v-col>
          <v-col cols="9">
            <v-img
              :src="selectedImage || product.product_image?.[0]?.url"
              height="500px"
              cover
              class="rounded-lg"
            />
          </v-col>
        </v-row>
      </v-col>

      <!-- Thông tin sản phẩm -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-2">{{ product.name }}</h2>
        <div class="text-subtitle-1 mb-1 text-primary">
          {{ formatPrice(product.price) }}
        </div>
        <div class="text-caption mb-3">SKU: {{ product.sku || 'Đang cập nhật' }}</div>

        <!-- Màu -->
        <div class="mb-3">
          <div class="font-weight-medium mb-2">Chọn màu</div>
          <v-row dense>
            <v-col
              v-for="(color, index) in colors"
              :key="color.id"
              cols="2"
              class="text-center"
            >
              <v-img
                :src="color.code"
                height="60"
                aspect-ratio="1"
                cover
                class="rounded color-option"
                @click="selectedColor = color.id"
                :class="{ 'active-color': selectedColor === color.id }"
              />
              <div class="text-caption mt-1">{{ color.name }}</div>
            </v-col>
          </v-row>
        </div>

        <!-- Size -->
        <div class="mb-3">
          <div class="font-weight-medium mb-2">Chọn size</div>
          <v-btn
            v-for="size in sizes"
            :key="size"
            class="mx-1 size-option"
            :class="{ 'active-size': selectedSize === size }"
            @click="selectedSize = size">
            {{ size }}
          </v-btn>

        </div>

        <!-- Tồn kho -->
        <div v-if="selectedColor && selectedSize" class="text-caption mb-3 text-success">
          Số lượng còn lại: {{ stockQuantity }}
        </div>

        <!-- Số lượng -->
        <div class="mb-5">
          <div class="font-weight-medium mb-2">Số lượng</div>
          <v-btn icon @click="decreaseQty">-</v-btn>
          <span class="mx-3">{{ quantity }}</span>
          <v-btn icon @click="increaseQty">+</v-btn>
        </div>

        <!-- Nút mua -->
        <div class="d-flex">
          <v-btn color="primary" class="me-4" @click="addToCart">
            Thêm vào giỏ
          </v-btn>
          <v-btn color="deep-orange-accent-3" @click="buyNow">
            Mua ngay
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref({})
const selectedImage = ref(null)
const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)
const stockQuantity = ref(null)

const increaseQty = () => quantity.value++
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const formatPrice = (price) =>
  price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const addToCart = () => {
  console.log('🛒 Thêm vào giỏ:', {
    productId: product.value.id,
    colorId: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value
  })
}

const buyNow = () => {
  console.log('💳 Mua ngay:', {
    productId: product.value.id,
    colorId: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value
  })
}

// Lấy danh sách màu duy nhất từ variants
const colors = computed(() => {
  const seen = new Map()
  return product.value.product_variants
    ?.filter((v) => v.colors)
    .filter((v) => {
      if (!seen.has(v.color_id)) {
        seen.set(v.color_id, true)
        return true
      }
      return false
    })
    .map((v) => v.colors) || []
})

// Lấy danh sách size duy nhất từ variants
const sizes = computed(() => {
  const seen = new Set()
  return product.value.product_variants
    ?.filter((v) => v.size_id && !seen.has(v.size_id))
    .map((v) => {
      seen.add(v.size_id)
      return v.size_id
    }) || []
})

// Theo dõi khi chọn màu và size => hiển thị tồn kho
watch([selectedColor, selectedSize], () => {
  if (selectedColor.value && selectedSize.value) {
    const variant = product.value.product_variants.find(
      (v) =>
        v.color_id === selectedColor.value && v.size_id === selectedSize.value
    )
    stockQuantity.value = variant?.stock_quantity || 0
  }
})

// Lấy dữ liệu sản phẩm từ API khi vào trang
onMounted(async () => {
  const { id } = route.params
  try {
    const res = await axios.get(`http://localhost:3000/products/${id}`)
    product.value = res.data.data
    selectedImage.value = product.value.product_image?.[0]?.url
  } catch (err) {
    console.error('❌ Lỗi khi lấy sản phẩm:', err)
  }
})
</script>

<style scoped>
.border {
  border: 2px solid #aaa;
  border-radius: 4px;
}
.border-primary {
  border-color: #1976d2 !important;
}
.color-option {
  transition: transform 0.2s, border 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.05);
  border-color: #bbb;
}

.active-color {
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.5);
}

.size-option {
  border: 1px solid #ccc;
  transition: background-color 0.2s, transform 0.2s;
  min-width: 40px;
}

.size-option:hover {
  background-color: #f5f5f5;
  transform: scale(1.05);
}

.active-size {
  background-color: #1976d2 !important;
  color: white !important;
  border-color: #1976d2 !important;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.3);
}

</style>
