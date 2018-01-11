import * as Chrome  from '../utils/chrome'
import './form'

!(async () => {
  const { users } = await Chrome.Storage.Local.get('users')
  document.querySelector('#username').insertAdjacentText('beforeend', users[Object.keys(users)[0]].screenName)
  document.querySelector('#userid').setAttribute('value', Object.keys(users)[0])
})()
