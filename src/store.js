import Cookies from 'js-cookie'
import SubX from 'subx'

import rc, { fetchGroup } from './ringcentral'
import { fetchPosts, download } from './util'

const store = SubX.create({
  ...Cookies.getJSON('glip-archiver'),
  async archive (groupId, days) {
    console.log(groupId, days)
    store.archiving = true

    const group = await fetchGroup(groupId)
    console.log(group)
    const records = await fetchPosts(rc, groupId, days)
    console.log(records)
    download(`glip-archive-${groupId}-${(new Date()).getTime()}.json`, JSON.stringify({ timestamp: (new Date()).getTime(), group, posts: records }))
    store.archiving = false
  }
})
store.$.subscribe(console.log)

const fetchGroups = async () => {
  const r = await rc.get('/restapi/v1.0/glip/groups', { params: { recordCount: 250, type: 'Team' } })
  store.groups = r.data.records
}
if (store.token) {
  rc.token(store.token)
  fetchGroups()
}
rc.on('tokenChanged', newToken => {
  store.token = newToken
  store.groups = []
  if (newToken) {
    fetchGroups()
  }
})
SubX.autoRun(store, () => {
  Cookies.set('glip-archiver', { token: store.token }, { expires: 3650 })
})

export default store
