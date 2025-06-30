import { createRouter, createWebHistory } from 'vue-router'
import adminRouter from './adminRouter.js'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import userRouter from './userRouter.js'
import authRouter from './authRouter.js'
import { getToken } from '@/store/auth'

const routes = [
    ...adminRouter,
    ...userRouter,
    ...authRouter,

    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!getToken()
  const adminToken = localStorage.getItem('admin_token')

  // Kiểm tra route cần đăng nhập user
   if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Kiểm tra route admin (tất cả path bắt đầu bằng /admin)
  if (to.path.startsWith('/admin') && to.name !== 'LoginAdmin' && !adminToken) {
    return next({ name: 'LoginAdmin' })
  }

  // Nếu không bị chặn thì cho qua
  next()
})

export default router
