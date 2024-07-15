function generateLinkFromFileId(fileId, fileName) {
  let link = `/api/file/${fileId}`
  if (fileName) {
    link += `?fileName=${fileName}`
  }
  return link
}

export { generateLinkFromFileId }
