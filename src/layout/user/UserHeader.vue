<template>
  <!-- Thanh app-bar chính -->
  <v-app-bar app flat class="px-3 shadow-bar">
    <!-- Logo -->
    <v-img
      :src="logo"
      max-height="60"
      max-width="60"
      class="cursor-pointer"
      @click="router.push('/')"
      contain
    />

    <v-spacer />

    <!-- Menu desktop -->
    <div class="d-none d-md-flex">
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.route"
        variant="text"
        class="mx-2"
      >
        <v-icon start>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </div>

    <v-spacer />

    <!-- Giỏ hàng -->
    <v-btn prepend-icon="mdi-cart" class="mr-4" to="/cart">
      Giỏ hàng
      <v-badge
        v-if="cartCount > 0"
        color="error"
        :content="cartCount"
        offset-x="-12"
        offset-y="8"
      />
    </v-btn>

    <!-- Đăng nhập -->
    <v-btn
      prepend-icon="mdi-account"
      color="primary"
      to="/login"
    >
      Đăng nhập
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/images/logo.png' // Đã import đúng

const router = useRouter()

const cartCount = ref(0) // Tạm thời cho là 0 hoặc liên kết Vuex/pinia sau

const menuItems = [
  { title: 'Trang chủ', icon: 'mdi-home', route: '/' },
  { title: 'Sản phẩm', icon: 'mdi-package', route: '/products' },
  { title: 'Giới thiệu', icon: 'mdi-information', route: '/about' },
  { title: 'Liên hệ', icon: 'mdi-phone', route: '/contact' }
]
</script>

<style scoped>
.top-bar {
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.cursor-pointer {
  cursor: pointer;
}
.shadow-bar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}


:deep(.v-badge__badge) {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
}
</style>
