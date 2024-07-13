/**
 *
 * @param {number} type
 * @returns {string}
 */
function MenuTypeConverter(type) {
  switch (type) {
    case 1:
      return 'Main Course'
    case 2:
      return 'Drinks'
    case 3:
      return 'Dessert'
    default:
      return 'Others'
  }
}

/**
 *
 * @param {number} type
 * @returns {string}
 */
function MenuStatusConverter(type) {
  switch (type) {
    case 1:
      return 'Not Active'
    case 2:
      return 'Not Available'
    case 3:
      return 'Sold Out'
    default:
      return 'Available'
  }
}

export { MenuTypeConverter, MenuStatusConverter }
