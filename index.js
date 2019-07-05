import RingCentral from 'ringcentral-js-concise'

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
  console.log(rc.token())
  await rc.revoke()
})()
