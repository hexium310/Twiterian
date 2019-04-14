import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { UsersList } from '../components/UsersList';
import { Modal } from '../components/Modal';

const GlobalStlye = createGlobalStyle`
  body {
    font-size: 100%;
  }
`;

export const App: React.FunctionComponent = (): React.ReactElement => {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <>
      <GlobalStlye />
      <UsersList setIsShown={setIsShown} />
      { isShown && <Modal setIsShown={setIsShown} /> }
    </>
  );
};
