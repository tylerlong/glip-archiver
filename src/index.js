import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import { Button, Spin } from 'antd'

import store from './store'
import rc from './ringcentral'

const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI

class Hello extends Component {
  handleFiles () {
    const element = document.getElementById('the-file')
    const file = element.files[0]
    const fileReader = new window.FileReader()
    fileReader.onload = event => {
      const text = event.target.result
      console.log(text)
    }
    fileReader.readAsText(file)
  }

  render () {
    const store = this.props.store
    let archiveBody
    if (!store.token) {
      archiveBody = <a href={rc.authorizeUri(redirectUri)}>Authorize me to access your Glip data</a>
    } else {
      archiveBody = <>
        <Button size='small' onClick={e => store.logout()}>Log out</Button>
        <br /><br />
        <select id='group-select'>{(store.groups || []).map(group => <option value={group.id} key={group.id}>{group.name || group.id}</option>)}</select>
        <br /> <br />
        {(!store.archiving && (store.groups || []).length > 0) ? <Button type='primary' onClick={e => store.archive(document.getElementById('group-select').value)}>Click here to archive</Button> : ''}
        {store.archiving ? <Spin size='large' /> : ''}
      </>
    }
    return <>
      <h1>Glip Archiver - Beta</h1>
      <h2>Archive your Glip data</h2>
      {archiveBody}
      <h2>Read archived data</h2>
      <input type='file' id='the-file' onChange={e => { this.handleFiles() }} />
    </>
  }
}

ReactDOM.render(<Hello store={store} />, document.getElementById('container'))
