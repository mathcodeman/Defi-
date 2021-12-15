import React from 'react';
import './App.css';
import { DAppProvider, ChainId } from '@usedapp/core'
import { Header } from './components/header'
import { Container } from "@material-ui/core"
import { Main } from './components/main';


function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan]
    }}>
      <Header />
      <Container maxWidth="md">
        <div>Hi!</div>
        <Main />
      </Container>

    </DAppProvider>
  );
}

export default App;
