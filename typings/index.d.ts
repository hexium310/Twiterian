interface User {
  screenName: string
  userId?: string
  access_token?: string
  accessToken?: string
  access_token_secret?: string
  accessTokenSecret?: string
  orderBy: number
}

interface Users {
  [userId?: string]: User
}

interface Tokens {
  oauthToken?: string
  oauthTokenSecret?: string
}

interface UserDetails {
  screenName: string;
  userId: string;
}

interface RequestTokens {
  requestToken: string;
  requestTokenSecret: string;
}

interface AccessTokens {
  accessToken: string;
  accessTokenSecret: string;
}

interface TwiterianStore {
  currentUserId?: string
  users: {
    [userId: string]: User
  }
}

interface TwiterianStorage extends TwiterianStore {
  count: number
  tokens: Tokens
}

interface Media {
  media_id: number
  media_id_string: string
  size: number
  expires_after_secs: number
  image: {
    image_type: string
    w: number
    h: number
  }
}

type Image = string;
