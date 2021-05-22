import React from 'react';
import cntl from 'cntl';
import { browser } from 'webextension-polyfill-ts';

import { ImageList } from './ImageList';

import config from '../../../config.json';
const { consumer_key: consumerKey, consumer_secret: consumerSecret } = config;

interface TweetFormProps {
  users: Users;
  currentUserIndex: number;
}

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
      <label className="flex items-end mb-1">
        <textarea
          className="resize-none w-96 h-32 border border-black"
          value={ tweet }
          autoFocus={ true }
          onChange={ (e) => handleTweetChange(e) }
          onPaste={ (e) => handlePaste(e) }
          onKeyDown={ (e) => handleKeyDown(e) }
        />
        <span
          className={ cntl`w-12 text-center ${ tweetCount >= 0 ? 'text-black' : 'text-red-600' }` }
        >{ tweetCount }</span>
      </label>
      <ImageList images={ images } setImages={ setImages } />
      <button
        className={ cntl`
          mt-1
          py-1
          px-2
          self-end
          border
          border-gray-400
          rounded-sm
        ` }
        onClick={ () => postTweet() }
      >POST</button>
    </>
  );
};
