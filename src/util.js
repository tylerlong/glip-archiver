export const fetchPosts = async (rc, groupId, pageToken = undefined) => {
  const r = await rc.get(`/restapi/v1.0/glip/chats/${groupId}/posts`, { params: { recordCount: 250, pageToken } })
  const records = r.data.records
  console.log(r.data)
  if (r.data.navigation && r.data.navigation.prevPageToken) {
    return [...records, ...(await fetchPosts(rc, groupId, r.data.navigation.prevPageToken))]
  } else {
    return records
  }
}

export const generateHash = str => {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
