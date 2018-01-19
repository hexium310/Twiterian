import { Store } from 'svelte/store'

import * as Chrome  from '../utils/chrome'
import AccountSelector from './components/AccountSelector.svelte'
import TweetForm from './components/TweetForm.svelte'

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')

  const store = new Store({
    current_user_id: Object.keys(users)[0],
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
