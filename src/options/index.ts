import { browser } from 'webextension-polyfill-ts'

import Modal from './components/Modal.svelte'
import UserList from './components/UserList.svelte'

import './index.css'

(async () => {
  const { users }: TwiterianStore = await browser.storage.local.get('users') as TwiterianStorage

  new UserList({
    data: {
      users,
    },
    target: document.querySelector('#main'),
  })
  new Modal({
    target: document.querySelector('#modal'),
  })
})()

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const { tokens: { oauthToken } }: { tokens: Tokens } =
        await browser.storage.local.get('tokens') as TwiterianStorage

      await browser.tabs.create({
        url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
      })

      break
    }

    case 'AddSuccess': {
      await browser.storage.local.remove('tokens')

      await browser.tabs.update({
        url: browser.runtime.getURL('options/index.html'),
      })
    }
  }

  return true
})
