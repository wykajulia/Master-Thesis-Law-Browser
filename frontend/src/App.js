import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActsList from './components/ActsList';
import ActText from './components/ActText';
import ActsTable from './components/ActsTable';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const App = () => {

  const shareSessionStorage = () => {
    window.addEventListener('storage', (event) => {
      const actHistory = sessionStorage.getItem('PreviousTitle')
      if(event.key === 'getSessionStorage' && actHistory) {
        localStorage.setItem('HISTORY_SHARING', actHistory)
        localStorage.removeItem('HISTORY_SHARING')
      }
      if (event.key === 'HISTORY_SHARING' && !actHistory) {
        sessionStorage.setItem('PreviousTitle', event.newValue)
      }
    })

    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
      localStorage.setItem('getSessionStorage', 'dummy data');
      localStorage.removeItem('getSessionStorage', 'dummy data');
    };

  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Container fluid className="p-4">
            <Row style={{ display: 'flex', justifyContent: 'center' }} >
              <Col>
                <h2 className="text-center">Laws Browser</h2>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
              <ActsList></ActsList>
            </Row>
          </Container>
        </Route>
        <Route path="/acts/:name/:year">
          <ActsTable />
        </Route>
        <Route path="/act-text/:name/:year/:pos">
          {shareSessionStorage()}
          <ActText />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
