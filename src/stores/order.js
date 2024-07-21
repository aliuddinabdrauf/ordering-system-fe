import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orderList = useStorage('order', [])

  function getTotalMenuInCart(id) {
    return orderList.value.filter((order) => order.id === id).length
  }
  function addMenuToCart(menu) {
    orderList.value.push(menu)
  }
  const totalCart = computed(() => orderList.value.length)
  return { orderList, getTotalMenuInCart, addMenuToCart, totalCart }
})
