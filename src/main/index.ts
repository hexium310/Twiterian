import { Store } from 'svelte/store'
import { browser } from 'webextension-polyfill-ts'

import AccountSelector from './components/AccountSelector.svelte'
import TweetForm from './components/TweetForm.svelte'

import './index.css'

(async () => {
  const { users, currentUserId }: TwiterianStore =
    await browser.storage.local.get(['users', 'currentUserId']) as TwiterianStorage

  const store: Store = new Store({
    currentUserId: currentUserId ||
    Object.entries(users)
    .filter(([k]: [string, User]) => k !== 'currentUserId')
    .sort(([, v]: [string, User], [, v2]: [string, User]) => v.orderBy - v2.orderBy)[0][0],
    users,
  })

  new AccountSelector({
    store,
    target: document.getElementById('account-selector'),
  })

  new TweetForm({
    store,
    target: document.body.querySelector('#tweet-form') as Element,
  })
})()
