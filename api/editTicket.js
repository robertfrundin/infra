/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import fetch from 'node-fetch'
import github from '@actions/github'
let { AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM } = process.env
console.log('1. Getting current ref:')
const tag = github.context.ref.split('/').pop()
const releaseNumber = getReleaseNumber(tag)

fetch(`https://api.tracker.yandex.net/v2/issues/${TICKET_QUERYPARAM}`, {
  method: 'PATCH',
  headers: {
    Authorization: AUTH_TOKEN,
    'X-Org-ID': ORG_ID,
  },
  body: JSON.stringify({
    summary: `Релиз ${releaseNumber}`,
  }),
})
  .then((res) => res.text())
  .then((data) => console.log(data))
  .catch(console.error)
