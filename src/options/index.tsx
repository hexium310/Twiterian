import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { App } from './components/App';

ReactDOM.render(
  <App/>,
  document.getElementById('main')
);

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const {
        tokens: {
          oauthToken,
        },
      } = await chrome.storage.local.get('tokens');

      await chrome.tabs.create({
        url: `https://api.twitter.com/oauth/authorize?oauth_token=${ oauthToken }`,
      });
      break;
    }

    case 'AddSuccess': {
      await chrome.storage.local.remove('tokens');
      await chrome.tabs.update({
        url: chrome.runtime.getURL('options/index.html'),
      });
      break;
    }
  }

  return true;
});
