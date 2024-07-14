/**
 *
 * @param {number} type
 * @returns {string}
 */
function menuTypeConverter(type) {
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

function menuTypeSeverityConverter(type) {
  switch (type) {
    case 1:
      return 'primary'
    case 2:
      return 'info'
    case 3:
      return 'warn'
    default:
      return 'secondary'
  }
}
/**
 *
 * @param {number} type
 * @returns {string}
 */
function menuStatusConverter(type) {
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
function menuStatusSeverityConverter(type) {
  switch (type) {
    case 1:
      return 'secondary'
    case 2:
      return 'warn'
    case 3:
      return 'danger'
    default:
      return 'primary'
  }
}

export {
  menuTypeConverter,
  menuStatusSeverityConverter,
  menuStatusConverter,
  menuTypeSeverityConverter
}
