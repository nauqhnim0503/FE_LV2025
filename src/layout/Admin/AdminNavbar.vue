<template>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="$emit('toggle-drawer')" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-white font-weight-bold">Admin Panel</v-toolbar-title>
            <v-list-item-title class="mr-4">
              <v-icon left>mdi-logout</v-icon>
              Logout
            </v-list-item-title>
    </v-app-bar>    
  </template>
  
  <script>
  export default {
    name: 'AdminNavbar',
  }
  </script>
  