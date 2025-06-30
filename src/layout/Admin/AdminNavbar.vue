<template>
  <v-app-bar app color="primary">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" color="white" />
    <v-toolbar-title class="text-white font-weight-bold">Admin Panel</v-toolbar-title>
    <v-list-item-title class="mr-4" @click="logout" style="cursor: pointer;">
      <v-icon left>mdi-logout</v-icon>
      Logout
    </v-list-item-title>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { clearAdminSession } from '@/store/authAdmin'  // sửa lại đường dẫn theo dự án

const router = useRouter()

function logout() {
  clearAdminSession()
  router.push('/admin/login')
}
</script>
