<template>
  <v-layout>
    <v-main>
      <v-container fluid class="pt-0 px-6 pb-6">
        <!-- Breadcrumbs -->
        <v-card flat class="mb-4">
          <v-card-text class="pa-2">
            <v-breadcrumbs :items="breadcrumbs">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right" color="grey"></v-icon>
              </template>
              <template v-slot:title="{ item }">
                <v-btn
                  :disabled="item.disabled"
                  variant="text"
                  :to="item.href"
                  class="text-none"
                  :class="{ 'current-page': item.disabled }"
                  density="comfortable">
                  {{ item.title }}
                </v-btn>
              </template>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>

        <!-- Main Content -->
        <v-card flat class="pt-0 px-6 pb-6">
          <router-view></router-view>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const items = [
    {
      title: 'Mã giảm giá',
      disabled: false,
      href: { name: 'discountManagement' }
    }
  ]

  if (route.name === 'createDiscount') {
    items.push({
      title: 'Thêm mới',
      disabled: true,
      href: route.path
    })
  } else if (route.name === 'updateDiscount') {
    items.push({
      title: 'Chỉnh sửa',
      disabled: true,
      href: route.path
    })
  }

  return items
})
</script>

<style scoped>
.current-page {
  cursor: default;
  opacity: 0.8;
}
</style>