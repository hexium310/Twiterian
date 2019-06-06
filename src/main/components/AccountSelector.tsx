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
  const changeUser = async (index: number): Promise<void> => {
    await browser.storage.local.set({
      currentUserIndex: index,
    });
    setCurrentUserIndex(index);
  };

  const changeToSelectedUser = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const userIndex = Number(event.target.value);
    changeUser(userIndex);
  };

  const changeToNextUser = (): void => {
    const userIndex = currentUserIndex + 1 !== users.length ? currentUserIndex + 1 : 0;
    changeUser(userIndex);
  };

  const changeToPreviousUser = (): void => {
    const userIndex = currentUserIndex - 1 >= 0 ? currentUserIndex - 1 : users.length - 1;
    changeUser(userIndex);
  };

  return (
    <AccountSelectorWrapper>
      User
      <Selector name="account" value={ currentUserIndex } onChange={ (event) => changeToSelectedUser(event) }>
        {
          users.map((user, index) => (
            <option key={ index } value={ index }>@{ user.screenName }</option>
          ))
        }
      </Selector>
      <button onClick={ () => changeToNextUser() }>↓</button>
      <button onClick={ () => changeToPreviousUser() }>↑</button>
    </AccountSelectorWrapper>
  );
};
