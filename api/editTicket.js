/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import fetch from 'node-fetch'
import github from '@actions/github'
import exec from '@actions/exec'
let { AUTH_TOKEN, ORG_ID, TICKET_QUERYPARAM } = process.env
const tag = github.context.ref.split('/').pop()
const execute = async (command, options) => {
  let res = ''
  let err = ''
  await exec.exec(command, options, {
    listeners: {
      stdout: (data) => {
        res += data.toString()
      },
      stderr: (data) => {
        err += data.toString()
      },
    },
  })
  if (err) {
    throw new Error(`Error: ${err}`)
  }
  return res
}
const author = github.context.payload.pusher.name
let prevTag = ''
for (let i = 0; i < tag.length; i++) {
  if (i !== tag.length - 1) {
    prevTag += tag[i]
  } else {
    prevTag += String(Number(tag[i]) - 1)
  }
}
const tagRange = `${prevTag}...${tag}`
const commits = await execute('git', ['log', '--pretty=format:"%h %an %s"', tagRange])
console.log(`Найденные коммиты:${commits}`)
fetch(`https://api.tracker.yandex.net/v2/issues/${TICKET_QUERYPARAM}`, {
  method: 'PATCH',
  headers: {
    Authorization: AUTH_TOKEN,
    'X-Org-ID': ORG_ID,
  },
  body: JSON.stringify({
    summary: `Релиз ${tag}`,
    description: `Ответственный за релиз: ${author}
    Коммиты, попавшие в релиз:
    ${commits}`,
  }),
})
  .then((res) => console.log('request finished with status:' + res.status))
  .catch(console.error)
