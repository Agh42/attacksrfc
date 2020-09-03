import React, { Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import {Link} from 'react-router-dom';
import { Icon } from 'semantic-ui-react'


class LinkToLogin extends Component {
    noop() {
        return undefined;
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
                        <i class="sign in link icon"></i>
                        Login
                    </div>
                </a>
            );
            } else {
                return (
                    <React.Fragment>
                     <Link to="/preferences" class="item" onClick={this.noop}>
                        <img class="ui avatar image" src={user.picture}></img>
                        <span>{user.nickname}</span>
                        <i class="caret down link icon"></i>
                    </Link>
                    <a class="link item"
                        target="_blank" rel="noopener noreferrer"  
                        onClick={() => logout({returnTo: window.location.origin})} >
                        <div class="middle aligned content">
                            <i class="sign out link icon"></i>
                            Logout
                        </div>
                    </a>
                    </React.Fragment>
                );
            }
    }
}

export default withAuth0(LinkToLogin);