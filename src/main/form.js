import * as Chrome  from '../utils/chrome'

document.querySelector('#tweet-box').addEventListener('paste', event => {
  if (event.clipboardData.types[0] === 'Files') {
    event.preventDefault()

    const fr = new FileReader()
    fr.onload = e => {
      if (document.querySelectorAll('.post-image').length >= 4) {
        return
      }

      document.querySelector('#image-list').insertAdjacentHTML(
        'beforeend',
        `<li><img class="post-image" src="${e.target.result}" alt=""></li>`
      )

      document.querySelector('ul :last-child img').addEventListener('click', event => {
        event.target.parentElement.remove()
      })
    }
    for (const item of event.clipboardData.files) {
      fr.readAsDataURL(item)
    }
  }
})

document.querySelector('#tweet-box').addEventListener('keydown', event => {
  if (event.key === 'Enter' && event.metaKey) {
    post()
  }
})

document.querySelector('#tweet-box').addEventListener('input', event => {
  document.querySelector('#count').textContent = (140 - event.target.textLength).toString()
  document.querySelector('#count').classList.toggle('invalid', event.target.textLength > 140)
})

document.querySelector('#post').addEventListener('click', post)

async function post() {
  const { users } = await Chrome.Storage.Local.get('users')
  const { consumer_key, consumer_secret } = require('../../config')
  const { access_token, access_token_secret } = users[document.querySelector('#userid').value]

  Chrome.Runtime.sendMessage({
    keys: {
      consumer_key,
      consumer_secret,
      access_token_key: access_token,
      access_token_secret,
    },
    tweet: {
      status: document.querySelector('#tweet-box').value,
      media: [...document.querySelectorAll('.post-image')].map(
        child => child.src.split(',')[1]
      ),
    },
  })

  while (document.querySelector('#image-list').firstChild) {
    document.querySelector('#image-list').removeChild(document.querySelector('#image-list').firstChild)
  }
  document.querySelector('#tweet-box').value = ''
}

