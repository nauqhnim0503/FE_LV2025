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

    <!-- Nếu đã đăng nhập -->
<template v-if="user">
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-account" color="primary">
        {{ user.name }}
        <v-icon end>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="router.push('/account')">
        <v-list-item-title>Thông tin tài khoản</v-list-item-title>
      </v-list-item>
      <v-list-item @click="router.push('/order')">
        <v-list-item-title>Đơn hàng của tôi</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>Đăng xuất</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<!-- Nếu chưa đăng nhập -->
<template v-else>
  <v-btn prepend-icon="mdi-account" color="primary" to="/login">
    Đăng nhập
  </v-btn>
</template>
  </v-app-bar>
</template>

<script setup>
import { ref,onMounted,computed,watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/store/useCart'
import { getUser } from '@/store/auth'
import logo from '@/assets/images/logo.png' 
import { clearUserSession } from '@/store/auth'

const router = useRouter()
const user = ref(getUser())
const { cartCount } = useCart() // Đếm số mặt hàng hiện lên giỏ

const menuItems = [
  { title: 'Trang chủ', icon: 'mdi-home', route: '/' },
  { title: 'Sản phẩm', icon: 'mdi-package', route: '/products' },
  { title: 'Giới thiệu', icon: 'mdi-information', route: '/about' },
  { title: 'Liên hệ', icon: 'mdi-phone', route: '/contact' }
]
onMounted(() => {
  user.value = getUser()
})
const loginText = computed(() => {
  return user.value ? `${user.value.name}!` : 'Đăng nhập'
})
const logout = () => {
  // Clear session/localStorage hoặc state quản lý user
  clearUserSession() // hoặc useAuthStore().logout() nếu dùng pinia
  user.value = null
  router.push('/')
}
watch(
  () => router.currentRoute.value.fullPath,
  () => {
    user.value = getUser()
  }
)
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
