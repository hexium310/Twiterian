import React from 'react';
import styled from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

import { consumer_key as consumerKey, consumer_secret as consumerSecret } from '../../../config.json';

export interface ModalPorps {
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalOverlay = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const ModalCloseDiv = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 300px;
  z-index: 101;
  background-color: white;
  transform: translate(-50%, -50%);
`;

const ModalBody = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;

  input {
    width: 3.5em;
  }
`;

const ModalFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PostButton = styled.button`
  height: 40px;
  width: 100px;
  margin-bottom: 10px;
  padding: 0.3em 1em;
  font-size: 20px;
  color: deepskyblue;
  text-decoration: none;
  border: solid 2px deepskyblue;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }
`;

export const Modal: React.FunctionComponent<ModalPorps> = ({
  setIsShown,
}): React.ReactElement => {
  const [pin, setPIN] = React.useState('');

  const handlePINChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPIN(event.target.value);
  };

  const postPIN = async (): Promise<void> => {
    const {
      tokens: {
        oauthToken,
        oauthTokenSecret,
      }
    } = await browser.storage.local.get('tokens');

    browser.runtime.sendMessage({
      type: 'GetAccessToken',
      data: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        oauthToken,
        oauthTokenSecret,
        oauth_verfier: pin,
      },
    });
  };

  return (
    <ModalOverlay>
      <ModalCloseDiv onClick={() => setIsShown(false)}></ModalCloseDiv>
      <ModalContent>
        <ModalBody>
          <label>
            PIN:
            <input type="text" value={pin} onChange={(e) => handlePINChange(e)}/>
          </label>
        </ModalBody>
        <ModalFooter>
          <PostButton onClick={() => postPIN()}>OK</PostButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
