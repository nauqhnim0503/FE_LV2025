<template>
  <v-container>
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
        class="pa-3"
      >
        <div class="product-wrapper">
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

          <div class="product-info">
            <router-link
              :to="{ name: 'ProductDetail', params: { id: product.id } }"
              class="text-decoration-none"
            >
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);

// Lấy sản phẩm từ API chính
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/");
    products.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
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
</style>
<style>
.font-title {
  font-family: 'Playfair Display', serif !important;
}
</style>