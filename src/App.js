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
import PricingPage from './Pages/PricingPage';

export default class App extends Component {
    
    _setPage = (page, route) => {
        this.setState({ page, route, currentMenu: null, modal: null, error: null });
    }
    
  render() {
    return (
            <Router>
                <Switch>
                    <Route path='/app/attacksrfc' component={AttackSrfcPage} />
                    <Route path='/pricing' component={PricingPage} />
                    <Route exact path='/' component={AttackSrfcPage} />
                    <Route exact path='/index.html' component={AttackSrfcPage} />
                    <Route render={({ location }) => (
                          <div className='ui inverted red segment'>
                            <h3>
                              Error! No matches for <code>{location.pathname}</code>
                            </h3>
                          </div>
                        )} />
                </Switch>
            </Router>
    );
  }
}
