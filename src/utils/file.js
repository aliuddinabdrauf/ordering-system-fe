/**
 *
 * @param {string} fileId uuid
 * @param {string} fileName custom file name
 * @returns {string} link to download the file
 */
function generateLinkFromFileId(fileId, fileName) {
  let link = `/api/file/${fileId}`
  if (fileName) {
    link += `?fileName=${fileName}`
  }
  return link
}

export { generateLinkFromFileId }
