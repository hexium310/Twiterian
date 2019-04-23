import React from 'react';
import styled, { css } from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

interface AccountSelectorProps {
  users: Users;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
}

interface DropDownListItemProps {
  isLoggedIn: boolean;
}

const AccountSelectorWrapper = styled.div`
  margin: 5px;
`;

const DropDown = styled.div`
  position: absolute;
  left: 76px;
  top: 8px;

  &:hover {
    cursor: default;
  }
`;

const DropDownList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const LoggedInUserFont = css`
  font-weight: bold;
`;

const DropDownListItem = styled.li`
  position: relative;
  left: -5px;
  padding: 0 5px 0 5px;
  background-color: lightgrey;
  ${ ({ isLoggedIn }: DropDownListItemProps) => isLoggedIn && LoggedInUserFont }

  &:hover {
    background-color: cornflowerblue;
  }
`;

const LoggedInUser = styled.span`
  ${ LoggedInUserFont }
`;

export const AccountSelector: React.FunctionComponent<AccountSelectorProps> = ({
  users,
  currentUserId,
  setCurrentUserId,
}): React.ReactElement => {
  const [isShow, setIsShow] = React.useState(false);

  const sortedUsers = Object.entries(users)
    .filter(([k, ]) => k !== 'currentUserId')
    .sort(([, v], [, v2]) => v.orderBy - v2.orderBy);

  const changeUser = async (index: number): Promise<void> => {
    const changedUserId = sortedUsers[index][0];

    await browser.storage.local.set({
      currentUserId: changedUserId,
    });

    setCurrentUserId(changedUserId);
  };

  return (
    <AccountSelectorWrapper>
      Logged in:
      <DropDown onClick={ () => setIsShow(!isShow) }>
        { isShow &&
          <DropDownList>
            { sortedUsers.map(([userId, user], index) => (
              <DropDownListItem
                isLoggedIn={ userId === currentUserId }
                key={ index }
                onClick={() => changeUser(index)}
              >
                @{ user.screenName }
              </DropDownListItem>
            )) }
          </DropDownList>
        }
        { !isShow &&
          <LoggedInUser>
            @{ users && currentUserId && users[currentUserId].screenName } <i className="fa fa-caret-down"></i>
          </LoggedInUser>
        }
      </DropDown>
    </AccountSelectorWrapper>
  );
};
