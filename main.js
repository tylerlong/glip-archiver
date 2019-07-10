import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'

const redirectUri = 'http://localhost:8080'

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)
const store = SubX.create({
  ...Cookies.getJSON('glip-archiver'),
  async newTask () {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const r = await rc.post('/restapi/v1.0/glip/data-export', { dateFrom: date.toISOString() })
    if (!this.tasks) {
      this.tasks = []
    }
    this.tasks.push({
      id: r.id
    })
  }
})
if (store.token) {
  rc.token(store.token)
}
rc.on('tokenChanged', newToken => {
  store.token = newToken
})
SubX.autoRun(store, () => {
  Cookies.set('glip-archiver', store.toJSON(), { expires: 3650 })
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
        <h3>Existing Archives</h3>
        <ul>{(store.tasks || []).map(task => <li>{task.id}</li>)}</ul>
        <h3>New Archive</h3>
        <button onClick={e => store.newTask()}>Click here to archive</button>
      </>
    }
    return <>
      <h1>Glip Archiver</h1>
      {body}
    </>
  }
}

ReactDOM.render(<Hello store={store} />, document.getElementById('container'))
