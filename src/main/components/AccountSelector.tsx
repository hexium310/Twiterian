import React from 'react';
import styled from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

interface AccountSelectorProps {
  users: Users;
  currentUserIndex: number;
  setCurrentUserIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AccountSelectorWrapper = styled.div`
  margin: 5px;
`;

const Selector = styled.select`
  margin-left: 5px;
`;

export const AccountSelector: React.FunctionComponent<AccountSelectorProps> = ({
  users,
  currentUserIndex,
  setCurrentUserIndex,
}): React.ReactElement => {
  const changeUser = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const userIndex = Number(event.target.value);
    await browser.storage.local.set({
      currentUserIndex: userIndex,
    });
    setCurrentUserIndex(userIndex);
  };

  return (
    <AccountSelectorWrapper>
      User
      <Selector name="account" value={ currentUserIndex } onChange={ (event) => changeUser(event) }>
        {
          users.map((user, index) => (
            <option key={ index } value={ index }>@{ user.screenName }</option>
          ))
        }
      </Selector>
    </AccountSelectorWrapper>
  );
};
