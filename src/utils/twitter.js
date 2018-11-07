import axios from 'axios'
import crypto from 'crypto'
import querystring from 'query-string'

const API_ROOT = 'https://api.twitter.com/1.1/'
const REQUEST_TOKEN = 'https://api.twitter.com/oauth/request_token'
const ACCESS_TOKEN = 'https://api.twitter.com/oauth/access_token'

export async function postRequestToken(consumerKey, consumerSecret, callback) {
  const { header } = _request('POST', REQUEST_TOKEN, {
    keys: {
      consumerKey,
      consumerSecret,
    },
  }, callback)

  return await axios.post(REQUEST_TOKEN, null, {
    headers: {
      Authorization: header,
    },
  }).then(response => {
    const data = querystring.parse(response.data)

    return {
      oauthToken: data.oauth_token,
      oauthTokenSecret: data.oauth_token_secret,
    }
  }).catch(error => {
    console.log(error)
  })
}

export async function postAccessToken(
  consumerKey,
  consumerSecret,
  oauthToken,
  oauthTokenSecret,
  verifier,
) {
  const {header} = _request('POST', ACCESS_TOKEN, {
    keys: {
      consumerKey,
      consumerSecret,
    },
    tokens: {
      oauthToken,
      oauthTokenSecret,
    },
    verifier,
  })

  // console.log(header);

  return await axios.post(ACCESS_TOKEN, null, {
    headers: {
      Authorization: header,
    },
  }).then(response => {
    const data = querystring.parse(response.data)

    return {
      accessToken: data.oauth_token,
      accessTokenSecret: data.oauth_token_secret,
      userId: data.user_id,
      screenName: data.screen_name,
    }
  }).catch(error => {
    console.log(error)
  })
}

function _request(method, endpoint, options = {}) {
  if (['GET', 'POST'].indexOf(method) < 0) {
    return
  }

  if ([REQUEST_TOKEN, ACCESS_TOKEN].indexOf(endpoint) < 0) {
    endpoint = API_ROOT + endpoint
  }

  let oauth_params = {
    oauth_consumer_key: options.keys.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor((new Date()).getTime() / 1000),
    oauth_version: '1.0a',
  }

  if (endpoint === REQUEST_TOKEN) {
    oauth_params = {
      // oauth_callback: 'oob',
      oauth_callback: chrome.extension.getURL('options/index.html'),
      ...oauth_params,
    }
  } else if (endpoint === ACCESS_TOKEN) {
    oauth_params = {
      ...oauth_params,
      oauth_verifier: options.verifier,
      oauth_token: options.tokens.oauthToken,
    }
  } else {
    const newOptions = {
      ...options,
    }
    delete newOptions.keys
    delete newOptions.tokens

    oauth_params = {
      ...oauth_params,
      ...newOptions,
      oauth_token: options.tokens.oauthToken
    }
  }

  const base = [
    method,
    endpoint,
    querystring.stringify(oauth_params),
  ].map(encodeURIComponent).join('&')

  const key = [
    options.keys.consumerSecret,
    options.keys.oauthTokenSecret || '',
  ].map(encodeURIComponent).join('&')

  const hmac = crypto.createHmac('sha1', key)
  hmac.update(base)
  oauth_params.oauth_signature = hmac.digest('base64')

  const header = 'OAuth ' + Object.entries(oauth_params).map(value => value.map(v => {
    v = encodeURIComponent(v)

    return v.toString().indexOf('oauth_') !== -1 ? v : `"${v}"`
  }).join('=')).join(', ')

  return {
    header
  }
}
