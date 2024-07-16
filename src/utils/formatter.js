/**
 *
 * @param {number} value the value of the currency
 * @returns {string} the formatted currency in MYR
 */
function currencyFormatter(value) {
  return value.toLocaleString('ms-MY', { style: 'currency', currency: 'MYR' })
}

export { currencyFormatter }
