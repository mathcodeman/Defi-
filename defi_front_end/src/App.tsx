import React from 'react';
import './App.css';
import { DAppProvider, Kovan } from '@usedapp/core'
import { Header } from './components/header'
import { Container } from "@material-ui/core"
import { Main } from './components/main';


function App() {
  return (
    <DAppProvider config={{
      networks: [Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>

    </DAppProvider>
  );
}

export default App;
