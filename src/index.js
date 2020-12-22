import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
  } from 'react-router-dom'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();



  

const onRedirectCallback = async appState => {
    var returnTo = (appState && 'returnTo' in appState && appState.returnTo)
        ? appState.returnTo : undefined;
    history.replace({
      pathname: returnTo || window.location.pathname,
      search: '',
    });
  };

ReactDOM.render(
    <Auth0Provider 
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENTID}
        redirectUri={window.location.origin}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        onRedirectCallback={onRedirectCallback}
    >
        <Router history={history}>
            <App />
        </Router>
    </Auth0Provider>,
    document.getElementById('root'));
//registerServiceWorker();
unregister();
