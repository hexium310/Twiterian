import { browser } from 'webextension-polyfill-ts';
import twitter from 'twitter';
import OAuth from 'oauth';

import { consumer_key as consumerKey, consumer_secret as consumerSecret } from '../config.json';

(async () => {
  const { users } = await browser.storage.local.get({ users: [] });
  if (!Array.isArray(users)) {
    browser.storage.local.clear();
  }
})();

const oa = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  'oob',
  'HMAC-SHA1'
);

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.keys && message.tweet) {
    const { access_token_key , access_token_secret } = message.keys;

    const client = new twitter({
      access_token_key,
      access_token_secret,
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    });

    const media = await Promise.all<Media>(
      message.tweet.media.map(
        (medium: string) => client.post('media/upload.json', {
          media_data: medium,
        }),
      ),
    );

    await client.post('statuses/update', {
      media_ids: media.map((res) => res.media_id_string).join(','),
      status: message.tweet.status,
    });

    return true;
  }

  if (!sender || !sender.tab) {
    return;
  }

  switch (message.type) {
    case 'AddAccount': {
      const { requestToken, requestTokenSecret } = await (() => new Promise<RequestTokens>(
        (resolve) => oa.getOAuthRequestToken(
          {},
          (_, requestToken, requestTokenSecret) => {
            resolve({
              requestToken,
              requestTokenSecret,
            });
          },
        ),
      ))();

      await browser.storage.local.set({
        tokens: {
          oauthToken: requestToken,
          oauthTokenSecret: requestTokenSecret,
        },
      });

      browser.tabs.sendMessage(sender.tab.id as number, {
        type: 'GotOAuthToken',
      });

      break;
    }

    case 'GetAccessToken': {
      const { oauthToken, oauthTokenSecret, oauth_verifier } = message.data;

      const {
        accessToken,
        accessTokenSecret,
        id,
        screenName,
      } = await (() => new Promise<User>(
        (resolve) => oa.getOAuthAccessToken(
          oauthToken,
          oauthTokenSecret,
          oauth_verifier,
          ( _, token, tokenSecret, results) => {
            resolve({
              accessToken: token,
              accessTokenSecret: tokenSecret,
              screenName: results.screen_name,
              id: results.user_id,
            });
          },
        ),
      ))();

      const { users } = await browser.storage.local.get({ users: [] });

      await browser.storage.local.set({
        users: [
          ...(users),
          {
            screenName,
            id,
            accessToken,
            accessTokenSecret,
          },
        ],
      });

      browser.tabs.sendMessage(sender.tab.id as number, {
        type: 'AddSuccess',
      });

      break;
    }

    case 'RemoveAccount': {
      await browser.storage.local.set({
        users: message.data.users,
      });

      break;
    }
  }

  return true;
});
