import { createRouter, createWebHistory } from 'vue-router'
import { SecuredRoutes } from './secured'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...SecuredRoutes]
})

export default router
