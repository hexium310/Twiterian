import { useState, FC, ChangeEvent, Dispatch, SetStateAction } from 'react';
import cntl from 'cntl';
import { browser } from 'webextension-polyfill-ts';

import config from '../../../config.json';
const { consumer_key: consumerKey, consumer_secret: consumerSecret } = config;

export interface ModalPorps {
  setIsShown: Dispatch<SetStateAction<boolean>>;
}

export const Modal: FC<ModalPorps> = ({
  setIsShown,
}) => {
  const [pin, setPIN] = useState('');

  const handlePINChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPIN(event.target.value);
  };

  const postPIN = async (): Promise<void> => {
    const {
      tokens: {
        oauthToken,
        oauthTokenSecret,
      },
    } = await browser.storage.local.get('tokens');

    browser.runtime.sendMessage({
      type: 'GetAccessToken',
      data: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        oauthToken,
        oauthTokenSecret,
        oauth_verifier: pin,
      },
    });
  };

  return (
    <div className={ cntl`
      flex
      fixed
      top-0
      left-0
      w-screen
      h-screen
      bg-black
      bg-opacity-20
      justify-center
      items-center
    ` }>
      <div
        className={ cntl`
          block
          fixed
          top-0
          left-0
          w-screen
          h-screen
          z-40
        ` }
        onClick={ () => setIsShown(false) }
      ></div>
      <div className={ cntl`
        flex
        p-8
        top-2/4
        left-2/4
        bg-white
        z-50
        flex-col
        items-center
      ` }>
        <h2 className={ cntl`
          text-4xl
          text-center
          w-full
          border-b-2
          border-divide-gray-400
        ` }>
          PIN
        </h2>
        <div>
          <input
            className={ cntl`
              my-4
              border
              border-solid
              border-gray-600
              text-center
            ` }
            type="text"
            value={ pin }
            placeholder="Input PIN here"
            onChange={ (e) => handlePINChange(e) }
          />
        </div>
        <div>
          <button
            className={ cntl`
              w-24
              py-1
              text-xl
              border-2
              border-solid
              border-blue-400
              text-blue-400
            ` }
            onClick={ () => postPIN() }
          >OK</button>
        </div>
      </div>
    </div>
  );
};
