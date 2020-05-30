import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class NewsListMenu extends Component {
    static propTypes = {
        links: PropTypes.object.isRequired,
        page: PropTypes.object.isRequired,
        onSelect: PropTypes.func.isRequired,
    }

    // Closes over 'link': 
    // returns onSelect function for the given argument, which will be called by onClick 
    // directly. I.e. onClick will call "this.props.onSelect('http://...')"
    select = (link) => {
        return (evt) => {
            this.props.onSelect(link);
        };
    };

    render() {
        return (
            <div className="ui fluid five item menu">
                <a onClick={this.select((this.props.links.first||{}).href)} 
                    className={(this.props.page.number>0) ? "icon item" : "disabled icon item"}>
                    <i className="fast backward  icon"  ></i>
                </a>
                <a onClick={this.select((this.props.links.prev||{}).href)} 
                    className={this.props.links.prev ? "icon item" : "disabled icon item"}>
                    <i className="chevron circle left icon"  ></i>
                </a>
                <a className="disabled icon item">
                    {this.props.page.number+1 + "/" + this.props.page.totalPages}
                </a>
                <a onClick={this.select((this.props.links.next||{}).href)} 
                    className={this.props.links.next ? "icon item" : "disabled icon item"}>
                    <i className="chevron circle right icon" ></i>
                </a>
                <a onClick={this.select((this.props.links.last||{}).href)} 
                    className={(this.props.page.number+1 < this.props.page.totalPages) ? "icon item" : "disabled icon item"}>
                    <i className="fast forward  icon" ></i>
                </a>
            </div>
        );
    }

}