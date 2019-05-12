import React from 'react';
import styled, { css } from 'styled-components';
import { browser } from 'webextension-polyfill-ts';

interface AccountSelectorProps {
  users: Users;
  currentUserIndex: number;
  setCurrentUserIndex: React.Dispatch<React.SetStateAction<number>>;
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
  currentUserIndex,
  setCurrentUserIndex,
}): React.ReactElement => {
  const [isShow, setIsShow] = React.useState(false);

  const changeUser = async (index: number): Promise<void> => {
    await browser.storage.local.set({
      currentUserIndex: index,
    });
    setCurrentUserIndex(index);
  };

  return (
    <AccountSelectorWrapper>
      Logged in:
      <DropDown onClick={ () => setIsShow(!isShow) }>
        { isShow &&
          <DropDownList>
            { users.map((user, index) => (
              <DropDownListItem
                isLoggedIn={ index === currentUserIndex }
                key={ index }
                onClick={ () => changeUser(index) }
              >
                @{ user.screenName }
              </DropDownListItem>
            )) }
          </DropDownList>
        }
        { !isShow && users.length !== 0 &&
          <LoggedInUser>
            @{ users[currentUserIndex].screenName } <i className="fa fa-caret-down"></i>
          </LoggedInUser>
        }
      </DropDown>
    </AccountSelectorWrapper>
  );
};
