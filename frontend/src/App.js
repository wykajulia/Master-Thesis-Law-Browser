import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActsList from './components/ActsList';
import ActText from './components/ActText';
import ActsTable from './components/ActsTable';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const App = () => {
  const setSessionStorage = (event) => {
    if (!event) { event = window.event; }
    if (!event.newValue) return;
    if (event.key == 'getSessionStorage') {
      // set sessionStorage in another tab
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
      localStorage.removeItem('sessionStorage'); 
    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
      // another tab sent data
      let data = JSON.parse(event.newValue);
      for (let key in data) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  }

  const shareSessionStorage = () => {
    // listen for changes to localStorage
    if (window.addEventListener) {
      window.addEventListener("storage", setSessionStorage, false);
    } else {
      window.attachEvent("onstorage", setSessionStorage);
    };

    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
      localStorage.setItem('getSessionStorage', 'dummy data');
      localStorage.removeItem('getSessionStorage', 'dummy data');
    };

  }

  return (
    <BrowserRouter>
      {shareSessionStorage()}
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
          <ActText />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
