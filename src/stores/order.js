import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orderList = useStorage('order', [])
  function addOrder(menu) {
    //find the menu in the orderList
    const order = orderList.value.find((order) => order.id === menu.id)
    if (order) {
      order.quantity++
      order.totalPrice = order.quantity * menu.price
    } else {
      orderList.value.push({ ...menu, quantity: 1, totalPrice: menu.price, note: '' })
    }
  }
  function updateOrder(menu, quantity) {
    const order = orderList.value.find((order) => order.id === menu.id)
    if (order) {
      order.quantity = quantity
    }
  }
  function removeOrder(menuId) {
    const index = orderList.value.findIndex((order) => order.id === menuId)
    if (index !== -1) {
      orderList.value.splice(index, 1)
    }
  }
  const totalOrder = computed(() => {
    return orderList.value.reduce((acc, order) => acc + order.quantity, 0)
  })
  const totalPrice = computed(() => {
    return orderList.value.reduce((acc, order) => acc + order.totalPrice, 0)
  })
  function totalOrderById(menuId) {
    return orderList.value.find((order) => order.id === menuId)?.quantity ?? 0
  }
  function clearOrder() {
    orderList.value.splice(0, orderList.value.length)
  }
  return {
    orderList,
    addOrder,
    updateOrder,
    totalOrder,
    totalOrderById,
    removeOrder,
    totalPrice,
    clearOrder
  }
})
