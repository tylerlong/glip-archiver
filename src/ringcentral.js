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

export const fetchGroup = async groupId => {
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
  return r.data
}

export const fetchPersons = async personIds => {
  const persons = await rc.batchGet('/restapi/v1.0/glip/persons', personIds, 30)
  return persons
}

export default rc
