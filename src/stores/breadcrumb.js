import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed, ref, reactive, watch } from 'vue'

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: () => ({
    breadCrumbItem: []
  }),
  getters: {
    breadCrumbs: (state) => {
      return [...state.breadCrumbItem]
    }
  }
})
