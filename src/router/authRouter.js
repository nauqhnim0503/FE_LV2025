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
  ]
}]

export default authRouter;
