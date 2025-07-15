<template>
  <v-app>
    <v-main>
      <router-view />
      <ChatBot/>
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
import ChatBot from '@/views/ChatBot.vue'
const { snackbar } = useSnackbar()

</script>
