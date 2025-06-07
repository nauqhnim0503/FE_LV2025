import UserLayout from "@/layout/user/UserLayout.vue";

const userRouter =[{
    path: '',
    component: UserLayout,
    children: [
        {
            path: '',
            name: 'HomePage',
            component: () => import('../views/User/HomePage.vue')
        },
        {
            path:'products',
            name:'Product',
            component:()=>import('../views/User/AllProducts.vue')
        },
        {
            path:'cart',
            name:'CartPage',
            component: () => import('../views/User/CartPage.vue')
            
        },
        {
            path: '/product/:id',
            name: 'ProductDetail',
            component: () => import('../views/User/ProductDetail.vue') 
        }
    ]
}]
export default userRouter;