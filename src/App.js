import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
  } from 'react-router-dom'

import AttackSrfcPage from './Pages/AttackSrfcPage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';


export default class App extends Component {
    
    loggedIn = false;
    
    _setPage = (page, route) => {
        this.setState({ page, route, currentMenu: null, modal: null, error: null });
    }
    
  render() {
    return (
            <Router>
                <Switch>
                    
                    <Route exact path='/' component={AttackSrfcPage} />
                    <Route path='/index.html' component={AttackSrfcPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/login' component={LoginPage} />
                    
                    <Route exact path="/homepage.html" render={() => {window.location.href="homepage.html"}} />
                   
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
            </Router>
    );
  }
}
