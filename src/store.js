import Cookies from 'js-cookie'
import SubX from 'subx'

import rc, { fetchGroup, fetchPersons } from './ringcentral'
import { fetchPosts, download, generateHash } from './util'

const store = SubX.create({
  ...Cookies.getJSON('glip-archiver'),
  async archive (groupId, days) {
    console.log(groupId, days)
    store.archiving = true

    const group = await fetchGroup(groupId)
    console.log(group)
    const persons = await fetchPersons(group.members)
    console.log(persons)
    const posts = await fetchPosts(rc, groupId, days)
    console.log(posts)
    const content = { timestamp: (new Date()).getTime(), group, persons, posts }
    content.hash = generateHash(JSON.stringify(content) + process.env.HASH_SALT)
    download(`glip-archive-${groupId}-${(new Date()).getTime()}.json`, JSON.stringify(content))
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
