<template>
 <UserHeader />
  <v-main class="main-content">
    <UserBanner v-if="showBanner" />
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
      </v-main>
  <UserFooter />
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

