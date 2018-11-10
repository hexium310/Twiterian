import * as Chrome  from '../utils/chrome'
import UserList from './components/UserList.svelte'
import Modal from './components/Modal'

import './index.css'

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')

  new UserList({
    target: document.querySelector('#main'),
    data: {
      users
    }
  })
  new Modal({
    target: document.querySelector('#modal'),
  })
})()

Chrome.Runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const { tokens: { oauthToken } } = await Chrome.Storage.Local.get('tokens')

      await Chrome.Tabs.create({
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
