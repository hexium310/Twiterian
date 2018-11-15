import { browser } from 'webextension-polyfill-ts'
import twitterAPI from 'node-twitter-api'
import twitter from 'twitter'

import config from '../config'

// Since currentUserId was moved to the storage root, delete users.currentUserId.
!(async () => {
  const { users } = await browser.storage.local.get('users')
  if (typeof users.currentUserId !== 'undefined') {
    delete users.currentUserId
    browser.storage.local.set({ users })
  }
})()

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.keys && message.tweet) {
    const { consumer_key, consumer_secret, access_token_key, access_token_secret } = message.keys

    const client = new twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret,
    })

    const media = await Promise.all(
      message.tweet.media.map(
        medium => client.post('media/upload.json', {
          media_data: medium,
        })
      )
    )

    await client.post('statuses/update', {
      status: message.tweet.status,
      media_ids: media.map(res => res.media_id_string).join(','),
    })

    return true
  }

  const { consumer_key, consumer_secret } = config
  const twitterOAuth = new twitterAPI({
    consumerKey: consumer_key,
    consumerSecret: consumer_secret,
    callback: 'oob',
  })

  switch (message.type) {
    case 'AddAccount': {
      const { oauthToken, oauthTokenSecret } = await (() => new Promise(
        resolve => twitterOAuth.getRequestToken(
          (error, requestToken, requestTokenSecret) => {
            resolve({ oauthToken: requestToken, oauthTokenSecret: requestTokenSecret })
          }
        )
      ))()

      await browser.storage.local.set({
        tokens: {
          oauthToken,
          oauthTokenSecret,
        }
      })

      browser.tabs.sendMessage(sender.tab.id, {
        type: 'GotOAuthToken',
      })

      break
    }

    case 'GetAccessToken': {
      const { oauthToken, oauthTokenSecret, oauth_verifier } = message.data
      const {
        accessToken,
        accessTokenSecret,
        userId,
        screenName,
      } = await (() => new Promise(
        resolve => twitterOAuth.getAccessToken(
          oauthToken,
          oauthTokenSecret,
          oauth_verifier,
          (error, accessToken, accessTokenSecret, results) => {
            resolve({
              accessToken,
              accessTokenSecret,
              userId: results.user_id,
              screenName: results.screen_name
            })
          }
        )
      ))()

      const { users, count } = await browser.storage.local.get({users: {}, count: 0})

      await browser.storage.local.set({
        users: {
          [userId]: {
            screenName,
            access_token: accessToken,
            access_token_secret: accessTokenSecret,
            orderBy: count,
          },
          ...(users),
        },
        count: count + 1,
      })

      browser.tabs.sendMessage(sender.tab.id, {
        type: 'AddSuccess',
      })

      break
    }

    case 'RemoveAccount': {
      await browser.storage.local.set({
        users: message.data.users
      })

      break
    }
  }

  return true
})
