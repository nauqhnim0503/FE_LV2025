<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">🛒 Giỏ hàng</h1>

    <div v-if="cartItems.length > 0" class="space-y-6">
      <div v-for="item in cartItems" :key="item.id" class="flex items-center border-b pb-4">
        <img :src="item.image" alt="Product" class="w-24 h-24 object-cover rounded mr-4" />
        <div class="flex-1">
          <h2 class="font-semibold text-lg">{{ item.name }}</h2>
          <p class="text-gray-600">Màu: {{ item.color }} | Size: {{ item.size }}</p>
          <p class="text-pink-600 font-semibold">
            Giá: {{ formatPrice(item.promotional) }}
          </p>
          <div class="flex items-center mt-2">
            <button @click="decreaseQty(item)" class="px-2 border rounded">-</button>
            <span class="px-3">{{ item.quantity }}</span>
            <button @click="increaseQty(item)" class="px-2 border rounded">+</button>
            <button @click="removeItem(item)" class="ml-4 text-red-600 hover:underline">Xoá</button>
          </div>
        </div>
      </div>

      <div class="text-right mt-6">
        <p class="text-xl font-bold">Tổng tiền: {{ formatPrice(totalPrice) }}</p>
        <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="checkout">
          Thanh toán
        </button>
      </div>
    </div>

    <p v-else class="text-center text-gray-600">Giỏ hàng của bạn đang trống.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cartItems = ref([])

const fakeColors = ['Đỏ 01', 'Xanh 02', 'Đen 03']
const fakeSizes = ['S', 'M', 'L', 'XL']

const fetchCartItems = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/products') // thay bằng endpoint thật của bạn
    const products = res.data.data

    cartItems.value = products.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      promotional: item.promotional,
      image: item.product_image?.[0]?.url || 'https://via.placeholder.com/100',
      quantity: 1,
      color: fakeColors[Math.floor(Math.random() * fakeColors.length)],
      size: fakeSizes[Math.floor(Math.random() * fakeSizes.length)],
    }))
  } catch (error) {
    console.error('Lỗi fetch API:', error)
  }
}

onMounted(() => {
  fetchCartItems()
})

const increaseQty = (item) => {
  item.quantity++
}

const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity--
}

const removeItem = (item) => {
  cartItems.value = cartItems.value.filter(p => p.id !== item.id)
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.promotional * item.quantity, 0)
)

const checkout = () => {
  alert('Chức năng thanh toán đang phát triển...')
}
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu muốn */
</style>
