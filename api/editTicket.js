/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import fetch from 'node-fetch'
const { AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM } = process.env
console.log('Значения:', AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM)
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
