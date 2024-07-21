/**
 *
 * @param {number} type
 * @returns {string}
 */
function menuTypeConverter(type) {
  switch (type) {
    case 1:
      return 'Santapan Utama'
    case 2:
      return 'Minuman'
    case 3:
      return 'Pencuci Mulut'
    default:
      return 'Lain-lain'
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
      return 'Tidak Aktif'
    case 2:
      return 'Tidak Tersedia'
    case 3:
      return 'Habis Terjual'
    default:
      return 'Tersedia'
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
