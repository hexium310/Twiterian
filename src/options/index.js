import querystring from 'query-string'

import { consumer_key, consumer_secret } from '../../config'
import * as Chrome  from '../utils/chrome'
import UserList from './components/UserList.svelte'

import './index.css'

if (!!window.location.search) {
  const { oauth_token = null, oauth_verifier = null } = querystring.parse(window.location.search.substring(1))

  history.replaceState(null, null, 'index.html')

  !(async () => {
    // const { consumer_key, consumer_secret } = require('../../config')
    const { tokens: { oauthToken, oauthTokenSecret } } = await Chrome.Storage.Local.get(['tokens'])
    if (oauth_token !== oauthToken) {
      return
    }

    await Chrome.Runtime.sendMessage({
      type: 'GetAccessToken',
      data: {
        consumer_key,
        consumer_secret,
        oauthToken,
        oauthTokenSecret,
        oauth_verifier
      },
    })
  })()
}

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')

  new UserList({
    target: document.querySelector('#main'),
    data: {
      users
    }
  })
})()

Chrome.Runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const { tokens: { oauthToken } } = await Chrome.Storage.Local.get('tokens')

      await Chrome.Tabs.update({
        url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`
      })

      break
    }

    case 'AddSuccess': {
      await Chrome.Storage.Local.remove('tokens')

      await Chrome.Tabs.update({
        url: Chrome.Runtime.getURL('options/index.html')
      })
    }
  }

  return true
})
