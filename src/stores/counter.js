import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'

export const useCounterStore = defineStore('counter', () => {
  const toaster = useToast()
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment, toaster }
})
