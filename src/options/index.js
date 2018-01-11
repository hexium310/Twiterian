import querystring from 'querystring'

import { postAccessToken, postRequestToken } from "../utils/twitter"
import { consumer_key, consumer_secret } from '../../config'

import * as Chrome  from '../utils/chrome'

document.querySelector('#add-user button').addEventListener('click', async () => {
  document.querySelector('#add-user button').setAttribute('disabled', '')
  document.querySelector('#add-user button').classList.remove('icon-hover')

  const { oauthToken, oauthTokenSecret } = await postRequestToken(consumer_key, consumer_secret)
  await Chrome.Storage.Local.set({
    tokens: {
      oauthToken,
      oauthTokenSecret,
    }
  })

  await Chrome.Tabs.update({
    url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`
  })
})

if (!!window.location.search) {
  const { oauth_token, oauth_verifier } = querystring.parse(window.location.search.substring(1))

  !(async () => {
    const { tokens: { oauthToken, oauthTokenSecret } } = await Chrome.Storage.Local.get(['tokens'])
    if (oauth_token !== oauthToken) {
      return
    }

    const { accessToken, accessTokenSecret, userId, screenName } = await postAccessToken(consumer_key, consumer_secret, oauthToken, oauthTokenSecret, oauth_verifier)
    const { users, count } = await Chrome.Storage.Local.get({users: {}, count: 0})
    await Chrome.Storage.Local.set({
      users: {
        [userId]: {
          screenName,
          access_token: accessToken,
          access_token_secret: accessTokenSecret,
          orderBy: count,
        },
        ...(users),
      },
      count: count + 1,
    })

    await Chrome.Storage.Local.remove('tokens')

    await Chrome.Tabs.update({
      url: Chrome.Runtime.getURL('options/index.html')
    })
  })()
}

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')
  for (const [index, [userid, { screenName }]] of Object.entries(users).sort(([, v], [, v2]) => v.orderBy - v2.orderBy).entries()) {
    document.querySelector('#add-user').insertAdjacentHTML(
      'beforebegin',
      `<tr key=${index}>
        <td><button class="delete icon-hover" value=${userid}><i class="fa fa-times fa-2x" aria-hidden="true"></i></button></td>
        <td>${screenName}</td>
      </tr>`
    )

    document.querySelector(`[key='${index}'] .delete`).addEventListener('click', async () => {
      document.querySelector(`[key='${index}']`).remove()

      delete users[userid]
      await Chrome.Storage.Local.set({
        users
      })
    })
  }
})()
