import React from 'react';
import styled from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

export interface UsersListProps {
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const Main = styled.div`
  position: absolute;
  top: 10%;
  left: 20%;
  width: 60%;
  border: 1px solid darkgray;
`;

const Title = styled.h2`
  margin-top: 20px;
  margin-bottom: 0;
  margin-left: 10px;
  padding-left: 5px;
`;

const UsersListTable = styled.table`
  border-spacing: 0;
  margin: 10px;

  td {
    padding: 5px;

    &:first-child {
      text-align: center;
    }
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;

  &:hover {
    color: red;
    cursor: pointer;
  }
`;

export const UsersList: React.FunctionComponent<UsersListProps> = ({
  setIsShown,
}): React.ReactElement => {
  const [users, setUsers] = React.useState<Users>({});

  React.useEffect(() => {
    (async () => {
      const { users } = await browser.storage.local.get({ users: {} });
      setUsers(users);
    })();
  }, [setUsers]);

  const sortedUsers = Object.entries(users)
    .filter(([k, ]) => k !== 'currentUserId')
    .sort(([, v], [, v2]) => v.orderBy - v2.orderBy);

  const addAccount = (): void => {
    setIsShown(true);

    browser.runtime.sendMessage({
      type: 'AddAccount',
    });
  };

  const removeAccount = (userId: string): void => {
    delete users[userId];
    setUsers(users);

    browser.runtime.sendMessage({
      type: 'RemoveAccount',
      data: {
        users,
      },
    });
  };

  return (
    <Main>
      <Title>Users</Title>
      <UsersListTable id="usersList">
        <tbody>
          {
            sortedUsers.map(([userId, value], index) => (
              <tr key={index}>
                <td>
                  <Button onClick={() => removeAccount(userId)}>
                    <i className="fa fa-times fa-2x"></i>
                  </Button>
                </td>
                <td>{ value.screenName }</td>
              </tr>
            ))
          }
          <tr>
            <td>
              <Button onClick={() => addAccount()}>
                <i className="fa fa-plus fa-2x"></i>
              </Button>
            </td>
          </tr>
        </tbody>
      </UsersListTable>
    </Main>
  );
};
