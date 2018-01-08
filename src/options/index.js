import querystring from 'querystring'

import { postAccessToken, postRequestToken } from "../utils/twitter"
import { consumer_key, consumer_secret } from '../../config'

document.querySelector('#add-user button').addEventListener(
  'click',
  async () => {
    document.querySelector('#add-user button').setAttribute('disabled', '')
    document.querySelector('#add-user button').classList.remove('icon-hover')

    const { oauthToken, oauthTokenSecret } = await postRequestToken(consumer_key, consumer_secret)
    chrome.storage.local.set({
      tokens: {
        oauthToken,
        oauthTokenSecret,
      }
    })
    chrome.tabs.update({url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`})
  }
)

if (!!window.location.search) {
  const { oauth_token, oauth_verifier } = querystring.parse(window.location.search.substring(1))
  chrome.storage.local.get(['tokens'], async ({ tokens: { oauthToken, oauthTokenSecret } }) => {
    if (oauth_token !== oauthToken) {
      return
    }

    const { accessToken, accessTokenSecret, userId, screenName } = await postAccessToken(consumer_key, consumer_secret, oauthToken, oauthTokenSecret, oauth_verifier)
    chrome.storage.local.get({users: {}, count: 0}, ({ users, count }) => {
      chrome.storage.local.set({
        users: {
          [userId]: {
            screenName,
            access_token: accessToken,
            access_token_secret: accessTokenSecret,
            orderBy: count,
          },
          ...(users),
        },
        count: ++count,
      })
    })

    chrome.storage.local.remove('tokens')
    chrome.tabs.update({url: chrome.extension.getURL('options/index.html')})
  })
}

chrome.storage.local.get(['users'], ({ users }) => {
  for (const [index, [userid, { screenName }]] of Object.entries(users).sort(([, v], [, v2]) => v.orderBy - v2.orderBy).entries()) {
    document.querySelector('#add-user').insertAdjacentHTML(
      'beforebegin',
      `<tr key=${index}>
        <td><button class="delete icon-hover" value=${userid}><i class="fa fa-times fa-2x" aria-hidden="true"></i></button></td>
        <td>${screenName}</td>
      </tr>`
    )

    document.querySelector(`[key='${index}'] .delete`).addEventListener(
      'click',
      () => {
        document.querySelector(`[key='${index}']`).remove()

        chrome.storage.local.get('users', ({ users }) => {
          delete users[userid]
          // chrome.storage.local.set({users})
        })
      }
    )
  }
})

// chrome.storage.local.get({users: {}, count: 0}, ({ users, count: c }) => {
//   console.log(users, c)
// })
