import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';


export const MESSAGE_INVENTORY_LIMIT = "inventory_limit";

export default class Message extends React.Component {



    static propTypes = {
        message: PropTypes.string.isRequired,
    };

    render() {
        return (
        <div className="ui negative icon message">
            <i className="warning circle icon"></i>
            <div class="content">
                {
                    {
                        [MESSAGE_INVENTORY_LIMIT]: (
                            <span>
                            You have reached your inventory limit. 
                            <Link to="/register" class="item">Upgrade your account</Link> to store more inventories.
                            </span>
                        ),
                    }[this.props.message]
                }
            </div>
        </div>
        );
    }
}

