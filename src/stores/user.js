import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed, ref, reactive, watch } from 'vue'
import { useJwt } from '@vueuse/integrations/useJwt'

const emailClaims = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const rolesClaims = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const idClaims = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const adminRole = 'ADMIN'
export const useUserStore = defineStore('user', () => {
  const authToken = useStorage('authToken', null)
  const jwtObject = ref(useJwt(authToken.value))
  const user = reactive({
    id: null,
    email: null,
    roles: []
  })
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)
  watch(
    authToken,
    (value) => {
      if (value) {
        jwtObject.value = useJwt(value)
      }
      if (jwtObject.value?.payload) {
        user.id = jwtObject.value.payload[idClaims]
        user.email = jwtObject.value.payload[emailClaims]
        user.roles = jwtObject.value.payload[rolesClaims]
        isAuthenticated.value = jwtObject.value.payload.exp > Date.now() / 1000
        isAdmin.value = user.roles.includes(adminRole) || user.roles === adminRole
        if (!isAuthenticated.value && authToken.value) {
          authToken.value = null
        }
      }
    },
    { immediate: true }
  )
  function logout() {
    authToken.value = null
  }
  return { user, isAuthenticated, isAdmin, authToken, logout }
})
