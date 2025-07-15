<template>
  <v-container class="py-10">
    <v-row>
      <!-- Danh sách sản phẩm -->
      <v-col cols="12" md="8" class="px-6">
        <h1 class="text-h5 font-weight-bold mb-4 font-title">🛒 Giỏ hàng</h1>
        <v-divider class="mb-4" />

        <v-row class="text-grey font-weight-bold mb-2" no-gutters>
          <v-col cols="6">Sản phẩm</v-col>
          <v-col cols="6" class="text-end">Số lượng</v-col>
        </v-row>
        <v-divider class="mb-2" />

        <div v-if="cartItems.length === 0" class="text-center py-10 text-subtitle-1" style="color: #888;">
          <div class="d-flex justify-center mb-4">
            <v-img
              max-width="300"
              src="https://theme.hstatic.net/1000197303/1001046599/14/empty-cart-desktop.png?v=16346"
            ></v-img>
          </div>
          <div class="text-center font-title">
            Giỏ hàng của bạn đang trống<br>
            Hãy <span
                  @click="goShopping"
                  style="color: #1867C0; cursor: pointer; text-decoration: none;">
                  thêm
                </span> sản phẩm vào giỏ nhé!
          </div>
          <div class="text-center pt-3 font-title">
            <v-btn
              variant="outlined"
              rounded
              color="primary"
              @click="goShopping">
              Mua sắm ngay
            </v-btn>
          </div>
        </div>

        <template v-else>
          <v-sheet
            v-for="(item, index) in cartItems"
            :key="index"
            class="mb-4 p-4"
            elevation="1"
            rounded
            style="border: 1px solid #e0e0e0;"
          >
            <v-row align="center" no-gutters>
              <v-col cols="12" sm="3">
                <v-img :src="item.image" aspect-ratio="1" cover class="rounded" />
              </v-col>

              <v-col cols="12" sm="6" class="ps-4 pb-16">
                <div class="text-subtitle-1 font-weight-medium">{{ item.name }}</div>
                <div class="mt-2">
                  <v-chip size="small" class="me-2" variant="outlined" style="border-color: #ccc; color: black;">
                    {{ item.color }}
                  </v-chip>
                  <v-chip size="small" variant="outlined" style="border-color: #ccc; color: black;">
                    {{ item.size }}
                  </v-chip>
                </div>
                <div class="mt-3">
                  <span class="text-subtitle-2 font-weight-bold text-primary">
                    {{ formatPrice(item.promotional || 0) }} 
                  </span>
                  <div class="mt-2">
                    <span class="text-body-2" style="text-decoration: line-through; color: #888;">
                      {{ formatPrice(item.price) }}
                    </span>
                  </div>
                </div>

              </v-col>

              <v-col cols="12" sm="3" class="d-flex align-center justify-end gap-2">
                <!-- Nút giảm -->
                <v-btn
                  icon
                  small
                  @click="decreaseQty(item)"
                  style="background-color: transparent !important; box-shadow: none !important;">
                <v-icon>mdi-minus</v-icon>
                </v-btn>

                <!-- Số lượng -->
                <div class="font-weight-bold price" style="min-width: 36px; text-align: center; font-size: 1.1rem;">
                  {{ item.quantity }}
                </div>

                <!-- Nút tăng -->
                <v-btn
                  icon
                  small
                  @click="increaseQty(item)"
                  style="background-color: transparent !important; box-shadow: none !important;">
                <v-icon>mdi-plus</v-icon>
                </v-btn>

                <!-- Xoá -->
                  <v-btn
                  icon
                  size="small"
                  @click="removeItem(item)"
                  style="background-color: transparent !important; box-shadow: none !important;">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </template>
      </v-col>

      <!-- Thông tin đơn hàng -->
      <v-col cols="12" md="4" >
        <v-card class="pa-4" elevation="3" rounded>
          <div class="text-h6 font-weight-bold mb-4 font-title">🧾 Đơn hàng</div>

          <template v-if="cartItems.length">
          <v-row class="mb-2">
            <v-col>Đơn giá:</v-col>
            <v-col class="text-end text-black price">{{ formatPrice(originalTotalPrice) }}</v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col>Số sản phẩm:</v-col>
            <v-col class="text-end price">{{ totalItems }}</v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col>Khuyến mãi:</v-col>
            <v-col class="text-end text-red price">-{{ formatPrice(totalPrice) }}</v-col>
          </v-row>

          <v-divider class="mb-4" />

          <v-row class="mb-5">
            <v-col><strong>Tổng tiền:</strong></v-col>
            <v-col class="text-end text-primary font-weight-bold price">
              {{ formatPrice(discountTotal) }}
            </v-col>
          </v-row>
          </template>

          <template v-else>
            <v-row class="mb-2">
              <v-col>Số sản phẩm:</v-col>
              <v-col class="text-end">0</v-col>
            </v-row>
          </template>
          <v-btn color="primary" block size="large" class="white--text" @click="checkout">
            <v-icon start>mdi-credit-card-outline</v-icon> THANH TOÁN
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <FloatingContact />
</template>

<script setup>
import { computed,ref } from 'vue'
import { useCart } from '@/store/useCart'
import { useRouter } from 'vue-router'
import { getToken } from '@/store/auth'
import { useSnackbar} from  '@/composables/useSnackbar'
import FloatingContact from '@/components/FloatingContact.vue'

const {showSnackbar} = useSnackbar()

const router = useRouter()
const { cartItems, removeFromCart,updateQuantity } = useCart()

const increaseQty = (item) => {
  if (item.quantity < item.maxQuantity) {
    updateQuantity(item.id, item.quantity + 1) // Truyền item.id, không phải item
  } else {
    showSnackbar(`Số lượng tối đa còn lại là ${item.maxQuantity}`,'warning')
  }
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = (item) => {
  removeFromCart(item.id)
}

const formatPrice = (price) =>
  typeof price === 'number'
    ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : 'Đang cập nhật'

const totalPrice = computed(() =>
  cartItems.value.reduce((total, item) => {
    // Giá sau giảm = giá gốc - tiền giảm
    const finalPrice = (typeof item.price === 'number' ? item.price : 0) 
                     - (typeof item.promotional === 'number' ? item.promotional : 0)
    return total + finalPrice * item.quantity
  }, 0)
)
const totalItems = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0)
)
const originalTotalPrice = computed(() =>
  cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
const discountTotal = computed(() =>
  originalTotalPrice.value - totalPrice.value
)

const goShopping = () => {
  router.push({ name: 'Product' }) // Thay 'HomePage' bằng tên route bạn muốn chuyển tới
}
const checkout = () => {
  if (cartItems.value.length === 0) {
    // Reload lại trang Cart
    router.replace({ name: 'CartPage' })
    return
  }

  if (!getToken()) {
    // Chưa đăng nhập => chuyển về trang đăng nhập và truyền query redirect=checkout
    router.push({ name: 'Login', query: { redirect: 'CheckOut' } })
  } else {
    // Đã đăng nhập => chuyển thẳng đến Checkout
    router.push({ name: 'CheckOut' })
  }
}
</script>
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