import { createRouter, createWebHistory } from 'vue-router'
import { SecuredRoutes } from './secured'
import { publicRoutes } from './public'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...SecuredRoutes, ...publicRoutes]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.name !== 'secured-login' && to.fullPath.includes('/secured')) {
    if (!userStore.isAuthenticated) {
      next({ name: 'secured-login' })
    } else {
      if (!userStore.isAdmin && to.fullPath.includes('/secured/menugroup')) {
        return
      } else {
        next()
      }
    }
  } else if (to.name === 'secured-login' && userStore.isAuthenticated) {
    next({ name: 'secured-home' })
  } else {
    next()
  }
})

export default router
