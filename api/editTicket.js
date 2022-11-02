/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import fetch from 'node-fetch'
let { AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM } = process.env
console.log('Значения:', AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM)
AUTH_TOKEN = 'OAuth y0_AgAAAAAORX7iAAiKUwAAAADSrwXzUUJKv9lBTL2U5mUMS0qfBSQhAS4'
ORG_ID = '7526988'
TICKET_QUERYPARAM = 'HOMEWORKSHRI-145'

fetch(`https://api.tracker.yandex.net/v2/issues/${TICKET_QUERYPARAM}`, {
  method: 'PATCH',
  headers: {
    Authorization: `OAuth ${AUTH_TOKEN}`,
    'X-Org-ID': `${ORG_ID}`,
  },
  body: JSON.stringify({
    summary: 'FETCH CHEEECK',
  }),
})
  .then((res) => res.text())
  .then((data) => console.log(data))
  .catch(console.error)
