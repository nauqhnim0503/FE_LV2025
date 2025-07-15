<template>
  <v-container>
    <div v-if="discountCodes.length" class="discount-codes mb-6">
      <h3 class="mb-2 font-weight-bold">Ưu đãi giảm giá</h3>
      <div class="scroll-wrapper"
          ref="scrollContainer"
          @mouseover="pauseScroll"
          @mouseleave="handleLeave"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove"
          :class="{ dragging: isDragging }">
        <div class="scroll-content" ref="scrollContent">
          <div
            v-for="code in doubleDiscountCodes"
            :key="code.id + '-' + Math.random()"
            class="scroll-chip-wrapper">
            <v-chip
              color="green lighten-4"
              text-color="green darken-2"
              outlined
              class="discount-chip"
              style="padding: 12px 12px 16px; min-width: 200px; min-height: 64px;">
              <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
                <div class="discount-code-name">{{ code.code }}</div>
                <div class="discount-code-note">
                  <template v-if="code.discount_type === 'fixed'">
                    Giảm {{ formatPrice(code.discount_value) }} đơn từ {{ formatPrice(code.min_order_value) }}
                  </template>
                  <template v-else-if="code.discount_type === 'percent'">
                    Giảm {{ code.discount_percent || code.discount_value }}% đơn từ {{ formatPrice(code.min_order_value) }}
                  </template>
                  <template v-else>Ưu đãi đặc biệt</template>
                </div>
              </div>
              <v-btn
                @click="saveDiscount(code)"
                :title="`Lưu mã ${code.code}`"
                class="rounded-button ml-2"
                color="green darken-1"
                variant="outlined"
                size="small">
                Lưu
              </v-btn>
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- 🛒 Danh sách sản phẩm -->
    <h2 class="mb-4 font-weight-bold">Sản phẩm nổi bật</h2>
    <v-row dense>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-3">
        <div class="product-wrapper">
          <router-link
            :to="{ name: 'ProductDetail', params: { id: product.id } }"
            class="no-underline">
            <v-card class="product-card" elevation="2">
              <v-img
                :src="product.product_image?.[0]?.url || 'https://via.placeholder.com/200'"
                height="350px"
                cover/>
            </v-card>
          </router-link>

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

            <div
              v-for="variant in getUniqueColors(product.product_variants)"
              :key="variant.color_id"
              class="color-dot me-2"
              :style="getColorStyle(variant.colors?.code)"
            ></div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
  v-model="snackbar.show"
  :color="snackbar.color"
  :timeout="snackbar.loading ? -1 : 3000"
  location="top right"
  rounded>
  <v-progress-circular
    v-if="snackbar.loading"
    indeterminate
    size="16"
    color="white"
    class="me-2"/>
  {{ snackbar.message }}
</v-snackbar>
  <FloatingContact />
</template>

<script setup>
import { ref, onMounted,computed } from "vue";
import axios from "axios";
import { useSnackbar } from '@/composables/useSnackbar'
import FloatingContact from '@/components/FloatingContact.vue'


const { snackbar,success, warning, error } = useSnackbar()
const products = ref([]);
const discountCodes = ref([]);
// animation
let isDragging = false
let startX = 0
let scrollLeft = 0
const scrollContainer = ref(null)
const scrollContent = ref(null)
//nhân số lượng mã giảm
const doubleDiscountCodes = computed(() =>
  [...discountCodes.value, ...discountCodes.value, ...discountCodes.value, ...discountCodes.value]
)
//hover
const pauseScroll = () => {
  if (scrollContent.value) {
    scrollContent.value.style.animationPlayState = 'paused'
  }
}
//resume srcoll
const resumeScroll = () => {
  if (scrollContent.value) {
    scrollContent.value.style.animationPlayState = 'running'
  }
}
//kéo ngang
const handleMouseDown = (e) => {
  isDragging = true
  scrollContainer.value.classList.add('dragging')
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

const handleMouseUp = () => {
  isDragging = false
  scrollContainer.value.classList.remove('dragging')
}

const handleMouseMove = (e) => {
  if (!isDragging) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 1.5 // tốc độ cuộn
  scrollContainer.value.scrollLeft = scrollLeft - walk
}
const handleLeave = () => {
  // Kết thúc kéo
  isDragging = false;
  scrollContainer.value.classList.remove('dragging');

  // Tiếp tục animation
  resumeScroll();
};
// Lấy sản phẩm từ API chính
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/");
    products.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
  }

  try {
    const resDiscount = await axios.get("http://localhost:3000/discount_codes/home");
    discountCodes.value = resDiscount.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy mã giảm giá:", err);
  }
});

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
const getColorStyle = (code) => {
    return {
      backgroundImage: `url('${code}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 0 0 1px #ddd',
    };
};
const saveDiscount = (code) => {
  try {
    const saved = JSON.parse(localStorage.getItem("savedDiscounts") || "[]");

    const exists = saved.some(item => item.code === code.code);
    if (!exists) {
      saved.push(code);
      localStorage.setItem("savedDiscounts", JSON.stringify(saved));
      success(`Đã lưu mã: ${code.code}`);
    } else {
      warning(`Mã ${code.code} đã được lưu trước đó`);
    }
  } catch (err) {
    console.error("Lỗi khi lưu mã:", err);
    error("Không thể lưu mã giảm giá");
  }
};
// Format giá VND
const formatPrice = (price) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
</script>

<style scoped>
.product-card {
  overflow: hidden;
  border-radius: 10px;
}
.product-card:hover {
  transform: translateY(-4px);
  transition: 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.product-wrapper {
  display: flex;
  flex-direction: column;
}
.product-info {
  padding-left: 3px;
  padding-top: 8px;
}
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #5e0808;
  display: inline-block;
}
.original-price {
  color: #888888; /* Màu xám */
  font-size: 16px;
}

.original-price.has-discount {
  text-decoration: line-through; /* Gạch ngang */
}
.discount-code-name {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.4;
  width: 100%;
}

.discount-code-note {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
  width: 100%;
  word-break: break-word;
}
.rounded-button {
  border-radius: 20px;
  padding: 2px 10px;
  text-transform: none;
  font-size: 0.75rem;
  min-width: unset;
  height: auto;
  line-height: 1.2;
}
.scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  position: relative;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scroll-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.scroll-content {
  display: flex;
  gap: 16px;
  animation: scroll-left 30s linear infinite;
}

.scroll-wrapper:hover .scroll-content {
  animation-play-state: paused;
}

.scroll-chip-wrapper {
  flex-shrink: 0;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.scroll-wrapper.dragging {
  cursor: grabbing;
  user-select: none;
}
.scroll-wrapper {
  cursor: grab;
}
</style>
<style>
.font-title {
  font-family: 'Playfair Display', serif !important;
}
</style>