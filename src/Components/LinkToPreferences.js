import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';



class LinkToPreferences extends Component {
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
        
        if (!isAuthenticated) {
            return (
                <div class="item">
                    <i className="grey cogs icon"
                        onClick={this.noop}></i>
                </div>
            );
            } else {
                return (
                <Link to="/preferences" class="item" onClick={this.noop}>
                    <i className="cogs link icon" />
                </Link>
                );
            }
    }
}

export default withAuth0(LinkToPreferences);