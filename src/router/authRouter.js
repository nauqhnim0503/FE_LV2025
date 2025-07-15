import UserLayout from "@/layout/user/UserLayout.vue";

const authRouter = [{
  path: '',
  component: UserLayout,
  children: [
    {
      path: 'account',
      name: 'Profile',
      component: () => import('../views/auth/Profile.vue')
    },
  ],
}, 
{
  path: '/forgot-password',
  name: 'ForgotPassword',
  component: () => import('../views/auth/ForgotPassword.vue'),
},
{
  path: '/reset-password',
  name: 'ResetPassword',
  component: () => import('../views/auth/ResetPassword.vue'),
},
{
  path: '/verify-OTP',
  name: 'verifyOTP',
  component: () => import('../views/auth/VerifyOTP.vue'),
},
]

export default authRouter;
