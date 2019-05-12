import React from 'react';
import styled from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

import { ImageList } from './ImageList';
import { consumer_key as consumerKey, consumer_secret as consumerSecret } from '../../../config.json';

interface TweetFormProps {
  users: Users;
  currentUserIndex: number;
}

interface TweetCounterProps {
  valid: boolean;
}

const TweetArea = styled.label`
  display: flex;
  align-items: flex-end;
`;

const TweetBox = styled.textarea`
  resize: none;
  width: 350px;
  height: 100px;
`;

const TweetCounter = styled.span`
  width: 50px;
  text-align: center;
  color: ${ ({ valid }: TweetCounterProps) => valid ? 'black' : 'red' };
`;

const TweetButton = styled.button`
  float: right;
`;

export const TweetForm: React.FunctionComponent<TweetFormProps> = ({
  users,
  currentUserIndex,
}): React.ReactElement => {
  const [tweet, setTweet] = React.useState('');
  const [tweetCount, setTweetCount] = React.useState(140);
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    (async () => {
      const { images: storedImages } = await browser.storage.local.get(({ images: [] }));
      Array.isArray(storedImages) && setImages(storedImages);
    })();
  }, [setImages]);

  React.useEffect(() => {
    browser.storage.local.set(({ images }));
  }, [images]);

  const postTweet = (): void => {
    const { accessToken, accessTokenSecret } = users[currentUserIndex];
    browser.runtime.sendMessage({
      keys: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret,
      },
      tweet: {
        status: tweet,
        media: images.map((image) => image.split(',')[1]),
      },
    });

    setTweet('');
    setImages([]);
  };

  const handleTweetChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setTweet(value);
    setTweetCount(140 - value.length);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    if (event.clipboardData.types[0] !== 'Files') {
      return;
    }
    event.preventDefault();

    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.clipboardData.files[0]);
    fileReader.onload = () => {
      if (images.length >= 4) {
        return;
      }

      const image = fileReader.result;
      typeof image === 'string' && setImages([...images, image]);
    };
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    event.key === 'Enter' && event.metaKey && postTweet();
  };

  return (
    <>
      <TweetArea>
        <TweetBox
          value={ tweet }
          autoFocus={ true }
          onChange={ (e) => handleTweetChange(e) }
          onPaste={ (e) => handlePaste(e) }
          onKeyDown={ (e) => handleKeyDown(e) }
        />
        <TweetCounter valid={ tweetCount >= 0 }>{ tweetCount }</TweetCounter>
      </TweetArea>
      <ImageList images={ images } setImages={ setImages } />
      <TweetButton onClick={ () => postTweet() }>POST</TweetButton>
    </>
  );
};
