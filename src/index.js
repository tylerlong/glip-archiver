import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import { Button, Spin, Tabs } from 'antd'

import store from './store'
import rc from './ringcentral'

const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI

class Hello extends Component {
  handleFiles (store) {
    store.uploading = true
    const element = document.getElementById('the-file')
    const file = element.files[0]
    const fileReader = new window.FileReader()
    fileReader.onload = event => {
      const text = event.target.result
      try {
        store.jsonFile = JSON.parse(text)
        store.uploading = false
      } catch (e) {
        // todo: show error message
      }
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
        <select id='records-limit-select'>
          <option value='500'>Last 500 records</option>
          <option value='1000'>Last 1000 records</option>
          <option value='3000'>Last 3000 records</option>
        </select>
        <br /><br />
        {(!store.archiving && (store.groups || []).length > 0) ? <Button type='primary' onClick={e => store.archive(document.getElementById('group-select').value, parseInt(document.getElementById('records-limit-select').value))}>Click here to archive</Button> : ''}
        {store.archiving ? <Spin size='large' /> : ''}
      </>
    }
    let messageDisplay = ''
    if (store.jsonFile) {
      const personsDict = Object.assign(...store.jsonFile.persons.map(person => ({ [person.id]: person })))
      messageDisplay = <ul>{(store.jsonFile.posts || []).map(post => {
        const person = personsDict[post.creatorId] || { firstName: '[Unknown', lastName: 'User]' }
        return <li key={post.id}>{person.firstName} {person.lastName}: {post.text ? post.text.replace(/!\[:Person\]\((.+?)\)/g, (match, capture) => {
          const p = personsDict[capture] || { firstName: '[Unknown', lastName: 'User]' }
          return `@${p.firstName} ${p.lastName}`
        }) : ''}</li>
      })}</ul>
    }
    return <>
      <h1>Glip Archiver - Beta</h1>
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab='Archive your Glip data' key='1'>
          {archiveBody}
        </Tabs.TabPane>
        <Tabs.TabPane tab='Read archived data' key='2'>
          <input type='file' id='the-file' onChange={e => { this.handleFiles(store) }} />
          <br /><br />
          {store.uploading ? <Spin size='large' /> : ''}
          {messageDisplay}
        </Tabs.TabPane>
      </Tabs>
    </>
  }
}

ReactDOM.render(<Hello store={store} />, document.getElementById('container'))
