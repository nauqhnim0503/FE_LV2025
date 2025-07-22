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
              @click="selectImage(index)"
              style="cursor: pointer; border: 1px solid #ddd; border-radius: 4px;"
            />
          </v-col>
          <v-col cols="9" class="position-relative d-flex justify-center align-center">
  <!-- Nút trái -->
  <v-btn
    icon
    size="small"
    class="arrow-button left"
    :disabled="currentImageIndex === 0"
    @click="prevImage"
  >
    <v-icon>mdi-chevron-left</v-icon>
  </v-btn>

  <!-- Ảnh lớn -->
  <v-img
    :src="selectedImage"
    max-width="605px"
    max-height="806px"
    class="rounded-lg mx-auto"
  />

  <!-- Nút phải -->
  <v-btn
    icon
    size="small"
    class="arrow-button right"
    :disabled="currentImageIndex === (product.product_image?.length || 0) - 1"
    @click="nextImage">
    <v-icon>mdi-chevron-right</v-icon>
  </v-btn>
</v-col>

        </v-row>
      </v-col>

      <!-- Thông tin sản phẩm -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-2 font-title">{{ product.name }}</h2>
        <div class="text-subtitle-1 mb-3">
          <span
            class="original-price"
            :class="{ 'has-discount': product.promotional }">
            {{ formatPrice(product.price) }}
          </span>
        
          <span
            v-if="product.promotional"
            class="text-error font-weight-bold ml-3">
            {{ formatPrice(product.promotional) }}
          </span>
        </div>

        <!-- Màu -->
        <div class="mb-3">
          <div class="font-weight-medium mb-2">Chọn màu</div>
          <v-row dense>
            <v-col
              v-for="(color, index) in colors"
              :key="color.id"
              cols="2"
              class="text-center">
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
  <div class="d-flex justify-space-between align-center mb-2 px-1">
    <div class="text-subtitle-2 font-weight-medium">Chọn size</div>
    <div class="text-caption text-blue" style="cursor: pointer;" @click="showSizeChart = true">
      Bảng size &gt;
    </div>
  </div>

  <v-row class="flex-wrap pl-3 pt-1">
    <v-btn
      v-for="size in sizes"
      :key="size.id"
      class="mx-1 mt-2 size-option"
      :class="{ 'active-size': selectedSize === size.id }"
      @click="selectedSize = size.id">
      {{ size.name }}
    </v-btn>
  </v-row>
</div>



<v-dialog v-model="showSizeChart" max-width="700px" transition="slide-y-transition">
  <v-card class="pa-4">
    <h3 class="text-h6 mb-4 text-center">Hướng dẫn chọn size</h3>
    <v-img
      src="https://theme.hstatic.net/1000197303/1001046599/14/marcsize.jpg?v=16496"
      class="rounded-lg"
      max-height="420"
      width="100%"
      contain
    />
    <v-card-actions class="justify-end mt-4">
      <v-btn text color="primary" @click="showSizeChart = false">Đóng</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>




        
        <!-- Tồn kho -->
        <div v-if="selectedColor && selectedSize" class="text-caption mb-3 pl-1 pt-1" :class="stockQuantity === 0 ? 'text-error' : 'text-success'">
          {{ stockQuantity === 0 ? 'Hết hàng' : 'Số lượng còn lại: ' + stockQuantity }}
        </div>

        <!-- Số lượng -->
        <div class="mb-5 pl-1">
          <div class="font-weight-medium mb-2 pl-1 pt-3">Số lượng</div>
          <v-btn icon @click="decreaseQty" :disabled="quantity <= 1 || stockQuantity === 0">-</v-btn>
          <span class="mx-3">{{ quantity }}</span>
          <v-btn icon @click="increaseQty" :disabled="quantity >= stockQuantity || stockQuantity === 0">+</v-btn>
        </div>

        <!-- Nút mua -->
        <div class="d-flex">
          <v-btn color="primary" class="me-4" @click="handleAddToCart" :disabled="stockQuantity === 0">
            Thêm vào giỏ
          </v-btn>
          <v-btn color="deep-orange-accent-3" @click="buyNow" :disabled="stockQuantity === 0">
            Mua ngay
          </v-btn>
        </div>
        <!-- Thông tin mở rộng -->
<v-expansion-panels
  v-model="expandedPanels"
  multiple
  elevation="0"
  class="mt-6 custom-panels">
  <v-expansion-panel>
    <v-expansion-panel-title class="custom-title">
      Chi tiết sản phẩm
      <template #actions>
        <v-icon class="expand-icon" :class="{ rotate: expandedPanels.includes(0) }">mdi-chevron-down</v-icon>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div class="description-text">
        <p v-for="(line, index) in product.description?.split('\n')" :key="index">
          {{ line }}
        </p>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>

  <v-expansion-panel>
    <v-expansion-panel-title class="custom-title">
      Hướng dẫn bảo quản
      <template #actions>
        <v-icon class="expand-icon" :class="{ rotate: expandedPanels.includes(1) }">mdi-chevron-down</v-icon>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <ul class="care-instructions">
        <li>Giặt tay để tránh bay màu hoặc xù lông, ủi nhiệt độ bình thường.</li>
        <li>Không vắt hoặc xoắn mạnh vì điều này có thể gây ra các nếp nhăn và ảnh hưởng đến độ bền, cấu trúc của vải.</li>
        <li>Phơi, ủi mặt trái sản phẩm.</li>
      </ul>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>
</v-col>
</v-row>
<!-- Đánh giá sản phẩm -->
<v-row class="mt-2" v-if="ratings.length > 0">
  <v-col cols="12" md="6">
    <div class="pl-2">
      <div class="d-flex align-center mb-1">
        <span class="me-2 font-weight-medium text-h6">ĐÁNH GIÁ SẢN PHẨM</span>
        <div class="d-flex align-center">
          <span class="me-3">
            <v-icon
              v-for="n in 5"
              :key="n"
              :color="getStarColor(n)"
              size="22">
              {{ getStarIcon(n) }}
            </v-icon>
          </span>
          <span class="me-3 text-subtitle-1">
            {{ averageRating.toFixed(1) }}/5
          </span>
          <span class="text-body-2 text-grey">
            ({{ ratings.length }} đánh giá)
          </span>
        </div>
      </div>

      <!-- Danh sách đánh giá chi tiết -->
      <div v-for="rating in ratings" :key="rating.id" class="mb-4 border-bottom pb-3">
      <div class="d-flex align-center mb-1">
        <div class="font-weight-medium">{{ rating.user?.email || 'Ẩn danh' }}</div>
        <div class="text-caption text-grey ms-12 mt-2" style="white-space: nowrap;">
          {{ formatDate(rating.createdAt) }}
        </div>
      </div>
        <div class="mb-1">
          <v-icon
            v-for="n in rating.star_rating"
            :key="n"
            color="yellow"
            size="15">
            mdi-star
          </v-icon>
        </div>
        <div class="text-body-2">{{ rating.comment }}</div>
      </div>
    </div>
  </v-col>
</v-row>

<!-- Nếu chưa có đánh giá -->
<v-row class="mt-2" v-else>
  <v-col cols="12" md="6">
    <div class="pl-2">
      <div class="d-flex align-center mb-1">
        <span class="me-2 font-weight-medium text-h6">ĐÁNH GIÁ SẢN PHẨM</span>
        <span class="me-3">
            <v-icon
              v-for="n in 5"
              :key="n"
              color="red"
              size="22">
              mdi-star
            </v-icon>
          </span>
      </div>
      <div class="text-body-2 text-grey">Sản phẩm chưa có đánh giá</div>
    </div>
  </v-col>
</v-row>
<!-- GỢI Ý SẢN PHẨM CÙNG DANH MỤC (SLIDER NGANG) -->
<v-row class="mt-10">
  <v-col cols="12">
    <h3 class="text-h6 mb-4 font-weight-bold">Sản phẩm cùng danh mục</h3>

    <v-slide-group show-arrows >
      <v-slide-group-item
        v-for="item in relatedProducts"
        :key="item.id">
        <v-card
          class="ma-2"
          width="180"
          elevation="2"
          @click="goToProduct(item.id)"
          style="cursor: pointer;">
          <v-img
            :src="item.product_image?.[0]?.url"
            height="180"
            cover/>
          <v-card-text>
            <div class="font-weight-medium text-subtitle-2 mb-1">{{ item.name }}</div>
            <div class="price-wrapper">
              <span
                :class="{ 'text-decoration-line-through text-grey': item.promotional }">
                {{ formatPrice(item.price) }}
              </span>
              <span
                v-if="item.promotional"
                class="text-error font-weight-bold ml-1 promotional-price">
                {{ formatPrice(item.promotional) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-col>
</v-row>
<v-overlay :model-value="isLoadingProduct" class="d-flex align-center justify-center" persistent>
  <v-progress-circular indeterminate color="primary" size="64" />
</v-overlay>
</v-container>
  <FloatingContact />
</template>

<script setup>
import { ref, onMounted, computed, watch  } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCart } from '@/store/useCart'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import FloatingContact from '@/components/FloatingContact.vue'

const{showSnackbar} = useSnackbar()
const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()
const product = ref({})
const selectedImage = ref(null)
const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)
const stockQuantity = ref(null)
const currentImageIndex = ref(0)
const expandedPanels = ref([])
const showSizeChart = ref(false)
const ratings = ref([])
const relatedProducts = ref([])
const isLoadingProduct = ref(false)

const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const total = ratings.value.reduce((sum, r) => sum + r.star_rating, 0)
  return total / ratings.value.length
})
const getStarIcon = (n) => {
  const rating = averageRating.value
  if (n <= Math.floor(rating)) return 'mdi-star' // Sao đầy
  if (n - rating <= 0.5) return 'mdi-star-half-full' // Sao nửa
  return 'mdi-star-outline' // Sao rỗng
}

const getStarColor = (n) => {
  return n <= Math.ceil(averageRating.value) ? 'yellow' : 'grey'
}
const fetchRelatedProducts = async (categoryId, excludeProductId) => {
  try {
    const res = await axios.get('http://localhost:3000/products')

    relatedProducts.value = res.data.data
      .filter(p =>
        p.is_active === true &&                 // ✅ chỉ lấy sản phẩm đang active
        p.category_id === categoryId &&        // cùng danh mục
        p.id !== excludeProductId              // không trùng với sản phẩm đang xem
      )
      .slice(0, 10) // lấy tối đa 10 sản phẩm
  } catch (err) {
    console.error('❌ Lỗi lấy sản phẩm liên quan:', err)
  }
}

const goToProduct = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextImage = () => {
  if (currentImageIndex.value < product.value.product_image.length - 1) {
    currentImageIndex.value++
    selectedImage.value = product.value.product_image[currentImageIndex.value].url
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    selectedImage.value = product.value.product_image[currentImageIndex.value].url
  }
}
const selectImage = (index) => {
  currentImageIndex.value = index
  selectedImage.value = product.value.product_image?.[index]?.url
}
const increaseQty = () => {
  if (quantity.value < stockQuantity.value) quantity.value++
}
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const formatPrice = (price) =>
  price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const getCartItemPayload = () => {
  if (!selectedColor.value || !selectedSize.value) {
    showSnackbar('Vui lòng chọn màu và size','warning')
    return null
  }

  const variant = product.value.product_variants.find(
    (v) =>
      v.color_id === selectedColor.value && v.size_id === selectedSize.value
  )

  return {
    id: product.value.id,
    name: product.value.name,
    price: Number(product.value.price) || 0,
    promotional: Number(product.value.promotional) || 0,
    image: selectedImage.value,
    colorId: selectedColor.value,
    color: colors.value.find(c => c.id === selectedColor.value)?.name || '',
    size: sizes.value.find(s => s.id === selectedSize.value)?.name || '',
    quantity: quantity.value,
    productId: product.value.id,
    variantId: variant?.id,
    originalPrice: Number(product.value.price) || 0,
    maxQuantity: variant?.stock_quantity || 0,
  }
}


const handleAddToCart = async () => {
  if (stockQuantity.value === 0) {
  showSnackbar('Sản phẩm đã hết hàng','warning')
  return
  }
  const payload = getCartItemPayload()
  if (!payload) return

  await addToCart(payload)
  showSnackbar('Đã thêm sản phẩm vào giỏ hàng','info')
}

const buyNow = async () => {
  if (stockQuantity.value === 0) {
    showSnackbar('Sản phẩm đã hết hàng','warning')
    return
  }
  const payload = getCartItemPayload()
  if (!payload) return

  const finalPrice = Number(product.value.promotional) || Number(product.value.price)
  payload.finalPrice = finalPrice

  sessionStorage.setItem('checkoutProduct', JSON.stringify(payload))
  router.push({ name: 'CheckOut' })
}


// Lấy danh sách màu duy nhất từ variants
const colors = computed(() => {
  const seen = new Map()
  return product.value.product_variants
    ?.filter((v) => v.colors != null)  // bỏ các phần tử có colors null
    .filter((v) => {
      if (selectedSize.value && v.size_id !== selectedSize.value) return false
      if (!seen.has(v.color_id)) {
        seen.set(v.color_id, true)
        return true
      }
      return false
    })
    .map((v) => v.colors)
    .filter(c => c != null)  // lọc tiếp để đảm bảo không có phần tử null
    || []
})

// Lấy danh sách size duy nhất từ variants
const sizes = computed(() => {
  const seen = new Set()
  return product.value.product_variants
    ?.filter((v) => v.size_id && v.sizes != null)
    .filter((v) => {
      if (selectedColor.value && v.color_id !== selectedColor.value) return false
      if (!seen.has(v.size_id)) {
        seen.add(v.size_id)
        return true
      }
      return false
    })
    .map((v) => v.sizes)
    .filter(s => s != null)
    || []
})

const fetchRatings = async (productId) => {
  try {
    const res = await axios.get('http://localhost:3000/rating')
    ratings.value = res.data.data.filter(
      r => r.product_id === productId && r.is_approved === 1
    )
  } catch (err) {
    console.error('Lỗi lấy đánh giá:', err)
  }
}
// Lấy dữ liệu sản phẩm từ API khi vào trang
onMounted(async () => {
  const { id } = route.params
  try {
    const res = await axios.get(`http://localhost:3000/products/${id}`)
    product.value = res.data.data
    selectedImage.value = product.value.product_image?.[0]?.url

    //đánh giá
    fetchRatings(product.value.id)
    fetchRelatedProducts(product.value.category_id, product.value.id)
  } catch (err) {
    console.error('❌ Lỗi khi lấy sản phẩm:', err)
  }
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
//reset lại quantity khi ng dùng đổi màu hoặc size
watch([selectedColor, selectedSize], () => {
  if (selectedColor.value && selectedSize.value) {
    const variant = product.value.product_variants.find(
      (v) =>
        v.color_id === selectedColor.value && v.size_id === selectedSize.value
    )
    stockQuantity.value = variant?.stock_quantity || 0
    quantity.value = 1 // Reset lại về 1 khi đổi màu/size
  }
})


//đổi ảnh trong detail
watch(() => product.value.product_image, (images) => {
  if (images?.length) {
    currentImageIndex.value = 0
    selectedImage.value = images[0].url
  }
})
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}
watch(() => route.params.id, async (newId) => {
  isLoadingProduct.value = true
  try {
    const res = await axios.get(`http://localhost:3000/products/${newId}`)
    product.value = res.data.data
    selectedImage.value = product.value.product_image?.[0]?.url

    // Reset các giá trị liên quan
    selectedColor.value = null
    selectedSize.value = null
    quantity.value = 1
    currentImageIndex.value = 0
    stockQuantity.value = null

    // Fetch lại đánh giá và sản phẩm liên quan
    await Promise.all([
      fetchRatings(product.value.id),
      fetchRelatedProducts(product.value.category_id, product.value.id)
    ])
  } catch (err) {
    console.error('❌ Lỗi khi reload sản phẩm khi thay đổi ID:', err)
  } finally {
    setTimeout(() => {
      isLoadingProduct.value = false
    }, 300)
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
.original-price {
  color: #888888; /* Màu xám */
  font-size: 15px;
}

.original-price.has-discount {
  text-decoration: line-through;
}
.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.arrow-button.left {
  left: 10px;
}

.arrow-button.right {
  right: 10px;
}
.custom-panels {
  border-top: 1px solid #e0e0e0;
  font-family: 'Roboto', sans-serif;
}

.custom-title {
  font-weight: 500;
  font-size: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.rotate {
  transform: rotate(180deg);
}

.panel-content {
  font-size: 15px;
  color: #444;
  padding-top: 8px;
  padding-bottom: 12px;
}
.v-slide-group {
  overflow-y: hidden;
}
.v-card:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
.price-wrapper {
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.2;
  display: flex;
  align-items: center;
}

.promotional-price {
  font-size: 14px;
}
.description-text p {
  margin-bottom: 10px;
  line-height: 1.6;
  text-align: justify; 
  font-size: 15px;
  color: #333;
}
.care-instructions {
  padding-left: 20px;
  font-size: 15px;
  color: #444;
  line-height: 1.6;
  text-align: justify;
}

.care-instructions li {
  margin-bottom: 8px;
  list-style-type: disc;
}

</style>
