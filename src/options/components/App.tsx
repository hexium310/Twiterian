import React from 'react';
import cntl from 'cntl';

import { UsersList } from '../components/UsersList';
import { Modal } from '../components/Modal';

export const App: React.FunctionComponent = (): React.ReactElement => {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <div className={ cntl`flex justify-center items-center` }>
      <UsersList setIsShown={ setIsShown } />
      { isShown && <Modal setIsShown={ setIsShown } /> }
    </div>
  );
};
