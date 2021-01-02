import React, { Component } from 'react';
import './App.css';
import 'intro.js/introjs.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom'
import AttackSrfcPage from './Pages/AttackSrfcPage';
import RegisterPage from './Pages/RegisterPage';
import PreferencesPage from './Pages/PreferencesPage';
import './fomantic/dist/semantic.min.css';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';


const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

export default class App extends Component {

  loggedIn = false;

  _setPage = (page, route) => {
    this.setState({ page, route, currentMenu: null, modal: null, error: null });
  }


  render() {
    //const reload = () => window.location.reload();
    return (

      <Switch>

        <Route exact path='/' component={AttackSrfcPage} />
        <Route path='/index.html' component={AttackSrfcPage} />
        <Route path='/register' component={RegisterPage} />
        <ProtectedRoute path="/preferences" component={PreferencesPage} />
        <Route exact path="/cve/:cveParam/:view" component={AttackSrfcPage} />
        <Route exact path="/cve/:cveParam" component={AttackSrfcPage} />


        {/*
                    <Route exact path="/homepage" render={() => {window.location.href="homepage.html"}} />
                    <Route path="/homepage.html" render={reload} />
                    <Route exact path="/homepage.html" render={() => <Redirect
                        to={{
                          pathname: "/homepage.html"
                        }}
                      />} 
                    />
                    */}

        <Route render={({ location }) => (
          <div className='ui inverted red segment'>
            <h3>
              Error! No routes for your URL.
                            </h3>
            If you feel that this is a mistake please <a href="https://github.com/Agh42/attacksrfc/issues">report this as an issue.</a>
            Or simply return <a href="/">HOME.</a>
          </div>
        )} />
      </Switch>

    );
  }
}
