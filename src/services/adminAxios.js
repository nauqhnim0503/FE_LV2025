// src/services/adminAxios.js
import axios from 'axios'

const adminAxios = axios.create({
  baseURL: 'http://localhost:3000', // API admin base path
})

adminAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default adminAxios
