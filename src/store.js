import { fetchPosts, download } from './util'
import Cookies from 'js-cookie'
import SubX from 'subx'
import RingCentral from 'ringcentral-js-concise'

export const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

const store = SubX.create({
  ...Cookies.getJSON('glip-archiver'),
  async archive (groupId, days) {
    console.log(groupId, days)
    store.archiving = true

    const records = await fetchPosts(rc, groupId, days)
    console.log(records)
    download(`glip-archive-${groupId}.json`, JSON.stringify(records))

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
