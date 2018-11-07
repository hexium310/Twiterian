import { Store } from 'svelte/store'

import * as Chrome  from '../utils/chrome'
import AccountSelector from './components/AccountSelector.svelte'
import TweetForm from './components/TweetForm.svelte'

import './index.css'

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')

  const store = new Store({
    currentUserId: users.currentUserId || Object.entries(users).filter(([k, ]) => k !== 'currentUserId').sort(([, v], [, v2]) => v.orderBy - v2.orderBy)[0][0],
    users
  })

  new AccountSelector({
    target: document.getElementById('account-selector'),
    store
  })

  new TweetForm({
    target: document.body.querySelector('#tweet-form'),
    store
  })
})()
