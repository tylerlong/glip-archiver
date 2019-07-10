import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'

const redirectUri = 'http://localhost:8080'

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

const store = SubX.create(Cookies.getJSON('glip-archiver'))

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
if (code) {
  (async () => {
    await rc.authorize({ code, redirectUri })
    store.token = rc.token()
  })()
}

class Hello extends Component {
  render () {
    const store = this.props.store
    let body
    if (!store.token) {
      body = <a href={rc.authorizeUri(redirectUri)}>Authorize me to access your Glip data</a>
    } else {
      body = <h2>Has token: {store.token.access_token}</h2>
    }
    return <>
      <h1>Glip Archiver</h1>
      {body}
    </>
  }
}

ReactDOM.render(<Hello store={store} />, document.getElementById('container'))
