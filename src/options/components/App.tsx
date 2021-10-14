import { useState, FC } from 'react';
import cntl from 'cntl';

import { UsersList } from '../components/UsersList';
import { Modal } from '../components/Modal';

export const App: FC = () => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className={ cntl`flex justify-center items-center` }>
      <UsersList setIsShown={ setIsShown } />
      { isShown && <Modal setIsShown={ setIsShown } /> }
    </div>
  );
};
