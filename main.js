import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-subx'
import SubX from 'subx'
import Cookies from 'js-cookie'
// import RingCentral from 'ringcentral-js-concise'

// const rc = new RingCentral()

console.log(process.env)

const store = SubX.create({
  cookies: Cookies.getJSON('glip-archiver')
})

class Hello extends Component {
  render () {
    const cookies = this.props.cookies || {}
    let body
    if (!cookies.token) {
      body = <h2>No token</h2>
    } else {
      body = <h2>Has token</h2>
    }
    return <>
      <h1>Glip Archiver</h1>
      {body}
    </>
  }
}

ReactDOM.render(<Hello cookies={store.cookies} />, document.getElementById('container'))
