import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'

const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

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

export default rc
