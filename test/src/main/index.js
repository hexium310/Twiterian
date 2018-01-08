import './form'

chrome.storage.local.get(['users'], ({ users }) => {
  document.querySelector('#username').insertAdjacentText('beforeend', users[Object.keys(users)[0]].screenName)
  document.querySelector('#userid').setAttribute('value', Object.keys(users)[0])
})
