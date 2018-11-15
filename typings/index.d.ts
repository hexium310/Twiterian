type User = {
  screenName: string
  access_token: string
  access_token_secret: string
  orderBy: number
}

interface TwiterianStore {
  currentUserId?: string
  users: {
    [userId: string]: User
  }
}

interface TwiterianStorage extends TwiterianStore {
  count?: number
}
