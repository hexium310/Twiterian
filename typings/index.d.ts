type User = {
  screenName: string
  access_token: string
  access_token_secret: string
  orderBy: number
}

interface Tokens {
  oauthToken?: string
  oauthTokenSecret?: string
}

interface TwiterianStore {
  currentUserId?: string
  users: {
    [userId: string]: User
  }
}

interface TwiterianStorage extends TwiterianStore {
  count?: number
  tokens: Tokens
}
