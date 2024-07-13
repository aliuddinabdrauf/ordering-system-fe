export const SecuredRoutes = [
  {
    path: '/secured/login',
    name: 'secured-login',
    component: () => import('@/views/secured/LoginView.vue')
  },
  {
    path: '/secured',
    name: 'secured',
    component: () => import('@/views/secured/SecuredView.vue'),
    children: [
      {
        path: '',
        name: 'secured-home',
        component: () => import('@/views/secured/HomeView.vue')
      },
      {
        path: 'menugroup',
        name: 'secured-menugroup',
        component: () => import('@/views/secured/menu/MenuGroupView.vue')
      }
    ]
  }
]