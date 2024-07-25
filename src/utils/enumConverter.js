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

function orderStatusConverter(type) {
  switch (type) {
    case 1:
      return 'Menyediakan'
    case 2:
      return 'Dihidangkan'
    case 3:
      return 'Ditolak'
    default:
      return 'Dipesan'
  }
}
function orderStatusSeverityConverter(type) {
  switch (type) {
    case 1:
      return 'warn'
    case 2:
      return 'primary'
    case 3:
      return 'danger'
    default:
      return 'info'
  }
}

export {
  menuTypeConverter,
  menuStatusSeverityConverter,
  menuStatusConverter,
  menuTypeSeverityConverter,
  orderStatusConverter,
  orderStatusSeverityConverter
}
