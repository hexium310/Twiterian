interface RequestTokens {
  requestToken: string;
  requestTokenSecret: string;
}

interface AccessTokens {
  accessToken: string;
  accessTokenSecret: string;
}

interface User extends AccessTokens {
  id: string;
  screenName: string;
}

type Users = User[];

interface Media {
  media_id: number;
  media_id_string: string;
  size: number;
  expires_after_secs: number;
  image: {
    image_type: string;
    w: number;
    h: number;
  };
}

type Image = string;
