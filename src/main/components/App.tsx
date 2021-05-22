import React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { AccountSelector } from './AccountSelector';
import { TweetForm } from './TweetForm';

// TODO: Use reducer and context of React Hooks for users.
export const App = (): React.ReactElement => {
  const [users, setUsers] = React.useState<Users>([]);
  const [currentUserIndex, setCurrentUserIndex] = React.useState<number>(0);

  React.useEffect(() => {
    (async () => {
      const {
        users: storedUsers,
        currentUserIndex :storedCurrentUserIndex,
      } = await browser.storage.local.get({
        users: [],
        currentUserIndex: 0,
      });

      Array.isArray(storedUsers) && setUsers(storedUsers);
      typeof currentUserIndex === 'number' && setCurrentUserIndex(storedCurrentUserIndex);
    })();
  }, [setUsers, setCurrentUserIndex]);

  return (
    <div className="m-2 flex flex-col">
      <AccountSelector users={ users } currentUserIndex={ currentUserIndex } setCurrentUserIndex={ setCurrentUserIndex } />
      <TweetForm users={ users } currentUserIndex={ currentUserIndex } />
    </div>
  );
};
