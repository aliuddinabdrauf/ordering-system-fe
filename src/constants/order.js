const orderStatus = {
  PLACED: 0,
  PREPARING: 1,
  COMPLETED: 2,
  REJECTED: 3,
  PAID: 4
}

const paymentType = {
  CASH: 0,
  QR_SCAN: 1,
  CARD: 2
}

export { orderStatus, paymentType }
