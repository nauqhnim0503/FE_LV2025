<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useSnackbar } from '@/composables/useSnackbar'

const { snackbar } = useSnackbar()
</script>
