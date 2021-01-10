import React, { Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import {Link} from 'react-router-dom';
import { Icon } from 'semantic-ui-react'


class LinkToLogin extends Component {
    noop() {
        return undefined;
    }

    handleLogout = () => {
        const {logout} = this.props.auth0;
        this.props.onSignOut();
        logout({returnTo: window.location.origin + "/homepage.html"});
    }

    render() {
        const {
            isLoading,
            isAuthenticated,
            error,
            user,
            loginWithRedirect,
            logout, 
        } = this.props.auth0;

        if (isLoading) {
            return (
                <div class="ui item">
                    <Icon loading name='spinner' />
                </div>
            );
        }
        
        if (!isAuthenticated) {
            return (
                <a class="link item"
                    target="_blank" rel="noopener noreferrer"  
                    onClick={() => loginWithRedirect()} >
                    <div class="middle aligned content">
                        <i class="hat wizard icon"></i>
                        Sign in / Sign up
                    </div>
                </a>
            );
            } else {
                return (
                    <React.Fragment>
                    { this.props.emailVerified ? "" :
                        <div className="item">
                            <div class="middle aligned content">
                                <i class="red user slash icon"></i>
                                Account restricted - please verify your email.
                            </div>
                        </div>
                    }
                     <Link to="/preferences" class="item" onClick={this.noop}>
                        <img class="ui avatar image" src={user.picture}></img>
                        <span>{user.nickname}</span>
                        &nbsp;
                        <i class="cogs icon"></i>
                    </Link>
                    <a class="link item"
                        target="_blank" rel="noopener noreferrer"  
                        onClick={this.handleLogout} >
                        <div class="middle aligned content">
                            <i class="sign out icon"></i>
                            Sign out
                        </div>
                    </a>
                    </React.Fragment>
                );
            }
    }
}

export default withAuth0(LinkToLogin);