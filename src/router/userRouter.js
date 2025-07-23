import UserLayout from "@/layout/user/UserLayout.vue";

const userRouter = [{
  path: '',
  component: UserLayout,
  children: [
    {
      path: '',
      name: 'HomePage',
      component: () => import('../views/User/HomePage.vue')
    },
    {
      path: 'products',
      name: 'Product',
      component: () => import('../views/User/AllProducts.vue')
    },
    {
      path: 'cart',
      name: 'CartPage',
      component: () => import('../views/User/CartPage.vue'),
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/User/ProductDetail.vue')
    },
    {
      path: '/checkout',
      name: 'CheckOut',
      component: () => import('../views/User/CheckOut.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/User/Order.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orderdetail/:id',
      name: 'OrderDetail',
      component: () => import('../views/User/OrderDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vnpay-return',
      name: 'VnpayReturn',
      component: () => import('../views/User/VNPayReturn.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cod-return',
      name: 'CodReturn',
      component: () => import('../views/User/CodReturn.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'about',
      name: 'AboutPage',
      component: () => import('../views/User/About.vue'),
    },
    {
      path: 'contact',
      name: 'ContactPage',
      component: () => import('../views/User/Contact.vue'),
    },
    {
      path: 'reels',
      name: 'Reels',
      component: () => import('../views/User/ReelsVideo.vue'),
    },
  ]
}]

export default userRouter;
