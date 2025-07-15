<template>
  <table border="1" >
   <thead>
    <tr>
      <td>STT</td>
      <td>Tên sản phẩm</td>
      <td>Giá</td>
    </tr>
   </thead>
   <tbody>
    <tr v-for="product in products" :key="product.id">
      <td>{{ product.id }}</td>
      <td>{{ product.name }}</td>
      <td>{{ product.price }}</td>
    </tr>
   </tbody>
  </table>
</template>

<script setup>
import {ref,onMounted } from 'vue'
import axios from 'axios';
import { get } from 'lodash';
const products = ref([]);

onMounted(async ()=>{
  try{
    const res = await axios.get('http://localhost:3000/products');
    products.value = res.data.data;
  }catch(err){
    console.log('Lỗi khi lấy sản phẩm:',err);
  }
})
</script>