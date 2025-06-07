<template>
  <v-app>
    <!-- Navbar ở trên cùng -->
    <AdminNavbar @toggle-drawer="drawer = !drawer" />

    <v-main class="main-content">
      <div class="layout-below-navbar">
        <!-- Sidebar bên trái -->
        <AdminSideBar :drawer="drawer" @update:drawer="drawer = $event" />

        <!-- Nội dung chính -->
        <div class="content-wrapper">
          <router-view />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import AdminNavbar from './AdminNavbar.vue';
import AdminSideBar from './AdminSidebar.vue';

export default {
  name: 'AdminLayout',
  components: { AdminNavbar, AdminSideBar },
  data() {
    return {
      drawer: true,
    };
  }
};
</script>

<style scoped>
.main-content {
  padding-top: 64px; /* Chiều cao của navbar (v-app-bar) */
}

.layout-below-navbar {
  display: flex;
}

.content-wrapper {
  flex: 1;
  padding: 30px;
}
</style>
