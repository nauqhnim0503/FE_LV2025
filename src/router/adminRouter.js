const adminRouter =[
    {
        path: '/admin/login',
        name: 'LoginAdmin',
        component: () => import('../views/Admin/LoginAdmin.vue')
    },
    {
        path: '/admin',
        component: () => import('../layout/Admin/AdminLayout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Admin/DashBoard.vue')
            },
            {
                path: 'brands',
                component: () => import('../views/Admin/brands/BrandsLayout.vue'),
                children:[
                {
                    path:"",
                    name:"brandsManagement",
                    component: () => import('../views/Admin/brands/BrandManagement.vue'),
                },
                {
                    path:"create",
                    name:"createBrand",
                    component: () => import('../views/Admin/brands/CreatePage.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateBrand",
                    component: () => import('../views/Admin/brands/UpdateBrands.vue'),
                }
               ]
            },
            {
                path: 'categories',
                component: () => import('../views/Admin/categories/LayoutCategories.vue'),
                children:[
                {
                    path:"",
                    name:"categoriesManagement",
                    component: () => import('../views/Admin/categories/CategoriesManagement.vue'),
                },
                {
                    path:"create",
                    name:"createCategories",
                    component: () => import('../views/Admin/categories/CreateCategories.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateCategories",
                    component: () => import('../views/Admin/categories/UpdateCategories.vue'),
                }
            ]
            },
            {
                path: 'products',
                component: () => import('../views/Admin/product/LayoutProduct.vue'),
                children:[{
                    path:"",
                    name:"productManage",
                    component: () => import('../views/Admin/product/ProductManage.vue'),
                },
                {
                    path:"create",
                    name:"createProducts",
                    component: () => import('../views/Admin/product/CreateProduct.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateProducts",
                    component: () => import('../views/Admin/product/UpdateProduct.vue'),
                },
                {
                  path: '/products/:id',
                  name: 'productDetails',
                  component: () => import('../views/Admin/product/DetailProduct.vue')
                }
            ]
            },
            {
                path: 'colors',
                component: () => import('../views/Admin/colors/LayoutColors.vue'),
                children:[
                {
                    path:"",
                    name:"colorsManagement",
                    component: () => import('../views/Admin/colors/ColorsManage.vue'),
                },
                {
                    path:"create",
                    name:"createColors",
                    component: () => import('../views/Admin/colors/CreateColors.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateColors",
                    component: () => import('../views/Admin/colors/UpdateColors.vue'),
                }
            ]
            },
            {
                path: 'sizes',
                component: () => import('../views/Admin/sizes/LayoutSizes.vue'),
                children:[
                {
                    path:"",
                    name:"sizesManagement",
                    component: () => import('../views/Admin/sizes/SizesManage.vue'),
                },
                {
                    path:"create",
                    name:"createSizes",
                    component: () => import('../views/Admin/sizes/CreateSizes.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateSizes",
                    component: () => import('../views/Admin/sizes/UpdateSizes.vue'),
                }
            ]
            },
            {
                path: 'discount',
                component: () => import('../views/Admin/discount/LayoutDiscount.vue'),
                children:[
                {
                    path:"",
                    name:"discountManagement",
                    component: () => import('../views/Admin/discount/ManageDiscount.vue'),
                },
                {
                    path:"create",
                    name:"createDiscount",
                    component: () => import('../views/Admin/discount/CreateDiscount.vue'),
                },
                {
                    path:"update/:id",
                    name:"updateDiscount",
                    component: () => import('../views/Admin/discount/UpdateDiscount.vue'),
                },
            ]
            },
            {
                path: 'order',
                component: () => import('../views/Admin/orders/OrderLayout.vue'),
                children:[
                {
                    path:"",
                    name:"ordersManagement",
                    component: () => import('../views/Admin/orders/OrderManage.vue'),
                },
            ]
            },
            {
                path: 'ratings',
                component: () => import('../views/Admin/ratings/RatingLayout.vue'),
                children:[
                {
                    path:"",
                    name:"ratingsManagement",
                    component: () => import('../views/Admin/ratings/RatingManage.vue'),
                },
            ]
            },
           {
            path: 'home',
            component: () => import('../views/HomeView.vue'),
           }

        ],
       
       
    },
    
]

export default adminRouter