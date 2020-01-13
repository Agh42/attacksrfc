import React, { Component } from 'react';
import './App.css';
import {
    HashRouter as Router,
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
    const reload = () => window.location.reload();
    return (
            <Router>
                <Switch>
                    
                    <Route path='/attacksrfc' component={AttackSrfcPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/login' component={LoginPage} />

                    <Route exact path='/' render={() => (
                      <Redirect
                        to='/attacksrfc'
                      />
                    )} />
                    <Route path="/homepage.html" render={reload} />

                    
                    {/*
                    <Route exact path='/index.html' render={() => (
                      <Redirect
                        to='/attacksrfc'
                      />
                    )} />

                    <Route path='/index.html' component={AttackSrfcPage} />
                    <Route exact path='/' component={AttackSrfcPage} />
                    <Route exact path="/" render={() => <Redirect
                        to={{
                          pathname: "/homepage.html"
                        }}
                      />} 
                    />
                    */}
                    
                    <Route render={({ location }) => (
                          <div className='ui inverted red segment'>
                            <h3>
                              Error! No routes for <code>{location.pathname}</code>
                            </h3>
                          </div>
                        )} />
                </Switch>
            </Router>
    );
  }
}
