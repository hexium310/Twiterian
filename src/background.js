import twitter from 'twitter'

import * as Chrome from './utils/chrome'

Chrome.Runtime.onMessage.addListener(async message => {
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
})
