import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import { Button } from 'antd'

import store from './store'
import rc from './ringcentral'

const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI

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
