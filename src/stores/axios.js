import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useLoading } from 'vue-loading-overlay'

export const useAxiosStore = defineStore('axios', () => {
  const toaster = useToast()
  const showErrorMessage = ref(true)
  const loading = useLoading({
    // options
  })
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status > 200 && showErrorMessage.value) {
        toaster.add({
          severity: 'error',
          summary: error.response.data?.Type ?? error.response.status,
          detail: error.response.data?.message ?? error.response.statusText,
          life: 4000
        })
      }
      return Promise.reject(error)
    }
  )
  const get = axiosInstance.get
  const post = axiosInstance.post
  const put = axiosInstance.put
  const patch = axiosInstance.patch
  const deleteRequest = axiosInstance.delete
  return { showErrorMessage, loading, get, post, put, patch, delete: deleteRequest }
})
