import { createRouter, createWebHistory } from 'vue-router'
import adminRouter from './adminRouter.js'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import userRouter from './userRouter.js'

const routes = [
    ...adminRouter,
    ...userRouter,

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

export default router
