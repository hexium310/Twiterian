import { browser, Runtime } from 'webextension-polyfill-ts'
import twitter from 'twitter'
import twitterAPI from 'node-twitter-api'

import config from '../config.json'

// Since currentUserId was moved to the storage root, delete users.currentUserId.
(async () => {
  const { users }: TwiterianStore = await browser.storage.local.get('users') as TwiterianStorage
  if (typeof users.currentUserId !== 'undefined') {
    delete users.currentUserId
    browser.storage.local.set({ users })
  }
})()

browser.runtime.onMessage.addListener(async (message: any, sender: Runtime.MessageSender) => {
  const { consumer_key, consumer_secret } = config

  if (message.keys && message.tweet) {
    const { access_token_key , access_token_secret } = message.keys

    const client = new twitter({
      access_token_key,
      access_token_secret,
      consumer_key,
      consumer_secret,
    })

    const media: Media[] = await Promise.all<Media>(
      message.tweet.media.map(
        (medium: string) => client.post('media/upload.json', {
          media_data: medium,
        }),
      ),
    )

    await client.post('statuses/update', {
      media_ids: media.map((res) => res.media_id_string).join(','),
      status: message.tweet.status,
    })

    return true
  }

  // const { consumer_key, consumer_secret } = config
  const twitterOAuth = new twitterAPI({
    callback: 'oob',
    consumerKey: consumer_key,
    consumerSecret: consumer_secret,
  })

  if (!sender || !sender.tab) {
    return
  }

  switch (message.type) {
    case 'AddAccount': {
      const { oauthToken, oauthTokenSecret }: Tokens = await (() => new Promise(
        (resolve) => twitterOAuth.getRequestToken(
          (_error: any, requestToken: string, requestTokenSecret: string) => {
            resolve({
              oauthToken: requestToken,
              oauthTokenSecret: requestTokenSecret,
            })
          },
        ),
      ))()

      await browser.storage.local.set({
        tokens: {
          oauthToken,
          oauthTokenSecret,
        },
      })

      browser.tabs.sendMessage(sender.tab.id as number, {
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
      }: User = await (() => new Promise(
        (resolve) => twitterOAuth.getAccessToken(
          oauthToken,
          oauthTokenSecret,
          oauth_verifier,
          (
            _error: any,
            token: string,
            tokenSecret: string,
            results: { user_id: number, screen_name: string },
          ) => {
            resolve({
              accessToken: token,
              accessTokenSecre: tokenSecret,
              sceenName: results.screen_name,
              userId: results.user_id,
            })
          },
        ),
      ))() as User

      const { users, count }: TwiterianStorage =
        await browser.storage.local.get({users: {}, count: 0}) as TwiterianStorage

      await browser.storage.local.set({
        count: count + 1,
        users: {
          [userId as any]: {
            access_token: accessToken,
            access_token_secret: accessTokenSecret,
            orderBy: count,
            screenName,
          },
          ...(users),
        },
      })

      browser.tabs.sendMessage(sender.tab.id as number, {
        type: 'AddSuccess',
      })

      break
    }

    case 'RemoveAccount': {
      await browser.storage.local.set({
        users: message.data.users,
      })

      break
    }
  }

  return true
})
