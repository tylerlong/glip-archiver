import SubX from 'subx'
import delay from 'timeout-as-promise'
import * as R from 'ramda'

import rc, { fetchGroup, fetchPersons } from './ringcentral'
import { fetchPosts, download, generateHash } from './util'

const store = SubX.create({
  ...JSON.parse(window.localStorage.getItem('glip-archiver')),
  async archive (groupId) {
    console.log(groupId)
    this.archiving = true
    const group = await fetchGroup(groupId)
    console.log(group)
    const posts = await fetchPosts(rc, groupId)
    console.log(posts)
    const persons = await fetchPersons(R.uniq([...group.members, ...posts.map(p => p.creatorId)]))
    console.log(persons)
    const timestamp = (new Date()).getTime()
    const content = { timestamp, group, persons, posts }
    content.hash = generateHash(JSON.stringify(content) + process.env.HASH_SALT)
    download(`glip-archive-${groupId}-${timestamp}.json`, JSON.stringify(content))
    this.archiving = false
  },
  async logout () {
    delete store.token
    await delay(1000)
    window.location.href = process.env.RINGCENTRAL_REDIRECT_URI
  }
})

const fetchGroups = async () => {
  try {
    const r = await rc.get('/restapi/v1.0/glip/groups', { params: { recordCount: 250, type: 'Team' } })
    // console.log((await rc.get('/restapi/v1.0/glip/persons/glip-4517666819')).text)
    store.groups = r.data.records
  } catch (e) {
    console.log(e.message)
    if (e.data && e.data.error_description && e.data.error_description.includes('Token not found')) {
      delete store.token
    } else {
      throw e
    }
  }
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
  window.localStorage.setItem('glip-archiver', JSON.stringify({ token: store.token }))
})

export default store
