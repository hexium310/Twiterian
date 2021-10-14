import React from 'react';
import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';
import cntl from 'cntl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { browser } from 'webextension-polyfill-ts';

interface UsersListProps {
  setIsShown: Dispatch<SetStateAction<boolean>>;
}

const buttonClassNames = cntl`
  hover:text-red-500
`;

export const UsersList: FC<UsersListProps> = ({
  setIsShown,
}) => {
  const [users, setUsers] = useState<Users>([]);

  useEffect(() => {
    (async () => {
      const { users: storedUsers } = await browser.storage.local.get({ users: [] });
      Array.isArray(storedUsers) && setUsers(storedUsers);
    })();
  }, [setUsers]);

  const addAccount = (): void => {
    setIsShown(true);

    browser.runtime.sendMessage({
      type: 'AddAccount',
    });
  };

  const removeAccount = (id: string): void => {
    const deletedUsers = users.filter((user) => user.id !== id);
    setUsers(deletedUsers);

    browser.runtime.sendMessage({
      type: 'RemoveAccount',
      data: {
        users: deletedUsers,
      },
    });
  };

  return (
    <div className={ cntl`
      mt-28
      w-2/3
      border
      border-solid
      border-gray-400
    ` }>
      <h1 className={ cntl`m-4` }>Users</h1>
      <div id="usersList" className={ cntl`flex flex-col m-4` }>
        {
          users.map((user, index) => (
            <div key={ index } className={ cntl`flex items-center` }
            >
              <button className={ buttonClassNames } onClick={ () => removeAccount(user.id) }>
                <FontAwesomeIcon icon={ faTimes } size="2x" className="fa-fw" />
              </button>
              <span>{ user.screenName }</span>
            </div>
          ))
        }
        <div>
          <button className={ buttonClassNames } onClick={ () => addAccount() }>
            <FontAwesomeIcon icon={ faPlus } size="2x" className="fa-fw" />
          </button>
        </div>
      </div>
    </div>
  );
};
