import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'
import { Button } from 'antd'

import { fetchPosts, download } from './util'

const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI

const rc = new RingCentral(
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

// 3-legged oauth
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
if (code) {
  (async () => {
    await rc.authorize({ code, redirectUri })
    await delay(100)
    window.location.href = redirectUri
  })()
}

class Hello extends Component {
  render () {
    const store = this.props.store
    let body
    if (!store.token) {
      body = <a href={rc.authorizeUri(redirectUri)}>Authorize me to access your Glip data</a>
    } else {
      body = <>
        <h2>Archive your Glip data</h2>
        <select id='group-select'>{(store.groups || []).map(group => <option value={group.id} key={group.id}>{group.name || group.id}</option>)}</select>
        <br /><br />
        <select id='days-select'>
          <option key='7' value='7'>last 7 days</option>
          <option key='30' value='30'>last 30 days</option>
          <option key='90' value='90'>Last 90 days</option>
          <option key='365' value='365'>Last 365 days</option>
        </select>
        <br /> <br />
        {(!store.archiving && (store.groups || []).length > 0) ? <Button type='primary' onClick={e => store.archive(document.getElementById('group-select').value, parseInt(document.getElementById('days-select').value))}>Click here to archive</Button> : ''}
      </>
    }
    return <>
      <h1>Glip Archiver - Beta</h1>
      {body}
    </>
  }
}

ReactDOM.render(<Hello store={store} />, document.getElementById('container'))
