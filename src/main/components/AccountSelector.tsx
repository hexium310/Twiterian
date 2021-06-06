import { FC, ChangeEvent, Dispatch, SetStateAction } from 'react';
import cntl from 'cntl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { browser } from 'webextension-polyfill-ts';

interface AccountSelectorProps {
  users: Users;
  currentUserIndex: number;
  setCurrentUserIndex: Dispatch<SetStateAction<number>>;
}

const buttonClassNames = cntl`
  mr-1
  border
  border-gray-500
  rounded-sm
`;

export const AccountSelector: FC<AccountSelectorProps> = ({
  users,
  currentUserIndex,
  setCurrentUserIndex,
}) => {
  const changeUser = async (index: number): Promise<void> => {
    await browser.storage.local.set({
      currentUserIndex: index,
    });
    setCurrentUserIndex(index);
  };

  const changeToSelectedUser = (event: ChangeEvent<HTMLSelectElement>): void => {
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
    <div className="mb-1">
      User
      <select
        className="ml-2 mr-1 border border-gray-500 rounded-sm"
        name="account"
        value={ currentUserIndex }
        onChange={ (event) => changeToSelectedUser(event) }
      >
        {
          users.map((user, index) => (
            <option key={ index } value={ index }>@{ user.screenName }</option>
          ))
        }
      </select>
      <button className={ buttonClassNames } onClick={ () => changeToNextUser() }>
        <FontAwesomeIcon icon={ faArrowDown } className="fa-fw" />
      </button>
      <button className={ buttonClassNames } onClick={ () => changeToPreviousUser() }>
        <FontAwesomeIcon icon={ faArrowUp } className="fa-fw" />
      </button>
    </div>
  );
};
