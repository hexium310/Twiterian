import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { App } from './components/App';

ReactDOM.render(
  <App/>,
  document.getElementById('main')
);

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case 'GotOAuthToken': {
      const {
        tokens: {
          oauthToken
        }
      } = await browser.storage.local.get('tokens') as TwiterianStorage;

      await browser.tabs.create({
        url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
      });
      break;
    }

    case 'AddSuccess': {
      await browser.storage.local.remove('tokens');
      await browser.tabs.update({
        url: browser.runtime.getURL('options/index.html'),
      });
      break;
    }
  }

  return true;
});
