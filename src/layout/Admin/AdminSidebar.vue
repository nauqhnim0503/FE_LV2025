<template>
    <v-navigation-drawer
      :model-value="drawer"
      @update:model-value="$emit('update:drawer', $event)"
      expand-on-hover
      app
      rail
    >
      <!-- User Info -->
      <v-list>
        <v-list-item
          :title="user.name"
          :subtitle="user.email"
          :prepend-avatar="user.avatar"
        />
      </v-list>
  
      <v-divider class="my-2" />
  
      <!-- Menu Items -->
      <v-list nav>
        <template v-for="item in menuItems" :key="item.title">
          <v-list-group v-if="item.children">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                rounded="lg"
                exact
              >
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.route"
              :prepend-icon="child.icon"
              rounded="lg"
              class="ml-4"
              exact
            >
              <v-list-item-title class="white--text">{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group><v-list-item
            v-else
            :to="item.route"
            :prepend-icon="item.icon"
            rounded="lg"
            class="mb-1"
            exact
          >
            <v-list-item-title class="white--text">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    name: 'AdminSideBar',
    props: {
      drawer: Boolean, // controlled from parent
    },
    emits: ['update:drawer'],
    data() {
      return {
        user: {
          name: "Minh Quân",
          email: "minhquan2002tv@gmail.com",
          avatar: "https://randomuser.me/api/portraits/men/85.jpg"
        },
        menuItems: [
          { title: "Dashboard", icon: "mdi-view-dashboard", route: "/admin" },
           { title: " Quản lý",
            icon: "mdi-flower",
            children: [
              { title: "Thương hiệu", icon: "mdi-tag", route: "/admin/brands" },
              { title: "Danh mục", icon: "mdi-format-list-bulleted", route: "/admin/categories" },
              { title: "Sản phẩm", icon: "mdi-package-variant", route: "/admin/products" },
              { title: "Màu sắc", icon: "mdi-palette", route: "/admin/colors" },
              { title: "Kích thước", icon: "mdi-ruler", route: "/admin/sizes" }
            ]
            },
          { title: "Đơn hàng", icon: "mdi-cart", to: "/admin/orders" },
          { title: "Đánh giá", icon: "mdi-flower", to: "/admin/products" },
        ]
      }
    }
  }
  </script>
<style scoped>

</style>
  