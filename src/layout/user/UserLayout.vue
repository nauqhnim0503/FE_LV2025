<template>
  <div class="user-layout">
    <UserHeader />
    <v-main class="main-content">
      <UserBanner v-if="showBanner" />
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
    <UserFooter />
  </div>
</template>

<script>
import UserFooter from './UserFooter.vue';
import UserBanner from './UserBanner.vue';
import UserHeader from './UserHeader.vue';
export default {
  name: 'UserLayout',
  components: { UserHeader, UserBanner , UserFooter, },
  data() {
    return {
      drawer: true,
      showBanner: true, // Biến để điều khiển hiển thị banner
    };
  },
   computed: {
    showBanner() {
      // Chỉ hiện banner ở trang chủ
      return this.$route.path === '/'
    }
  },
};
</script>
<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}

.main-content {
  flex: 1 0 auto;
  padding: 50px 0;
  overflow: auto;
  box-sizing: border-box;
}
</style>
