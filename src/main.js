import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueLazyLoad from 'vue3-lazyload'

loadFonts()

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.use(VueLazyLoad, {
  loading: '/spinner.gif',   // ảnh hiển thị trong lúc đang tải
  error: '/error.jpg',       // ảnh fallback nếu load lỗi
  attempt: 1                 // số lần thử tải lại ảnh (nếu fail)
})

app.mount('#app')