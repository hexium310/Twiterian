import twitter from 'twitter'

import * as Chrome from './utils/chrome'
import { postAccessToken, postRequestToken } from "./utils/twitter"

Chrome.Runtime.onMessage.addListener(async (message, sender) => {
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
  }

  switch (message.type) {
    case 'AddAccount': {
      const { consumer_key, consumer_secret } = require('../config')
      const { oauthToken, oauthTokenSecret } = await postRequestToken(consumer_key, consumer_secret)

      await Chrome.Storage.Local.set({
        tokens: {
          oauthToken,
          oauthTokenSecret,
        }
      })

      Chrome.Tabs.sendMessage(sender.tab.id, {
        type: 'GotOAuthToken',
      })

      break
    }

    case 'GetAccessToken': {
      const {
        accessToken,
        accessTokenSecret,
        userId,
        screenName
      } = await postAccessToken(...Object.values(message.data))
      const { users, count } = await Chrome.Storage.Local.get({users: {}, count: 0})

      await Chrome.Storage.Local.set({
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

      Chrome.Tabs.sendMessage(sender.tab.id, {
        type: 'AddSuccess',
      })

      break
    }

    case 'RemoveAccount': {
      await Chrome.Storage.Local.set({
        users: message.data.users
      })

      break
    }
  }

  return true
})
