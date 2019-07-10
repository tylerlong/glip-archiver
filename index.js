import RingCentral from 'ringcentral-js-concise'
import fs from 'fs'

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

;(async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })
  // console.log(rc.token())
  var ourDate = new Date()
  var pastDate = ourDate.getDate() - 7
  ourDate.setDate(pastDate)
  // const r = await rc.post('/restapi/v1.0/glip/data-export', { dateFrom: ourDate.toISOString() })
  const taskId = '809646016-62264425016-6015e8ba930d4d5e87cf85eb1d8d00ff'
  // const r = await rc.get(`/restapi/v1.0/glip/data-export/${taskId}`)
  // console.log(r.data)
  const r2 = await rc.get(`https://media.ringcentral.com/restapi/v1.0/glip/data-export/${taskId}/archive/1`, {
    responseType: 'arraybuffer'
  })
  fs.writeFileSync('data.zip', Buffer.from(r2.data, 'binary'))
  await rc.revoke()
})()
