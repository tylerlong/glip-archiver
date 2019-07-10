export const fetchPosts = async (rc, groupId, days) => {
  const r = await rc.get(`/restapi/v1.0/glip/chats/${groupId}/posts`, { params: { recordCount: 250 } })
  return r.data.records
}

export const download = (filename, text) => {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
