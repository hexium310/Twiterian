import { browser } from 'webextension-polyfill-ts'

import UserList from './components/UserList.svelte'
import Modal from './components/Modal'

import './index.css'

!(async () => {
  const { users } = await browser.storage.local.get('users')

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

browser.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const { tokens: { oauthToken } } = await browser.storage.local.get('tokens')

      await browser.tabs.create({
        url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`
      })

      break
    }

    case 'AddSuccess': {
      await browser.storage.local.remove('tokens')

      await browser.tabs.update({
        url: browser.runtime.getURL('options/index.html')
      })
    }
  }

  return true
})
