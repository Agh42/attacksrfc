import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
//import './LoginPage.css';
// TODO prevent body style from affecting other pages

const colStyle= {
        maxWidth: '450px',
};

const gridStyle={
        height: '100%',
};

export default class LoginPage extends Component {
    
    state={
            _redirect: "",
    };
    
    handleLoginClick = () => {
        this.setState({_redirect: "LOGIN"});
    }
    
    render() {
        if (this.state._redirect) {
            return {
                LOGIN: <Redirect push to="/register" />, 
            }[this.state._redirect];
        }
        return (
                <div class="ui middle aligned center aligned grid" style={gridStyle}>
                  <div class="column" style={colStyle} >
                    <h2 class="ui teal image header">
                      <img src="/images/logos/cstoolio.PNG" class="image"/>
                      <div class="content">
                        Log-in to your account
                      </div>
                    </h2>
                    <form class="ui large form">
                      <div class="ui stacked segment">
                        <div class="field">
                          <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input type="text" name="email" placeholder="E-mail address"/>
                          </div>
                        </div>
                        <div class="field">
                          <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" placeholder="Password"/>
                          </div>
                        </div>
                        <button class="ui fluid large teal submit button"
                            onClick={this.handleLoginClick}
                            >Login</button>
                      </div>
                
                      <div class="ui error message"></div>
                
                    </form>
                
                    <div class="ui message">
                      New here? <Link to="/register">Sign Up</Link> or <Link to="/">go back</Link>.
                    </div>
                  </div>
                </div>
            );
    }
}