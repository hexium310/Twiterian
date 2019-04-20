import React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { AccountSelector } from './AccountSelector';
import { TweetForm } from './TweetForm';

export const App = (): React.ReactElement => {
  const [users, setUsers] = React.useState<Users>({});
  const [currentUserId, setCurrentUserId] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      const {
        users,
        currentUserId,
      } = await browser.storage.local.get({
        users: {},
        currentUserId: '',
      }) as TwiterianStore;
      const sortedUsers = Object.entries(users)
        .filter(([k, ]) => k !== 'currentUserId')
        .sort(([, v], [, v2]) => v.orderBy - v2.orderBy);

      setUsers(users);
      setCurrentUserId(currentUserId || sortedUsers[0][0]);
    })();
  }, [setUsers, setCurrentUserId]);

  return (
    <>
      <AccountSelector users={ users } currentUserId={ currentUserId } setCurrentUserId={ setCurrentUserId } />
      <TweetForm users={ users } currentUserId={ currentUserId } />
    </>
  );
};
