export const publicRoutes = [
  {
    path: '/public',
    name: 'public',
    component: () => import('@/views/public/PublicView.vue'),
    children: [
      {
        path: ':tableId',
        name: 'public-order',
        component: () => import('@/views/public/OrderView.vue')
      }
    ]
  }
]
