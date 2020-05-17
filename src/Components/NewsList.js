import React, { Component } from 'react';
import PropTypes from 'prop-types';


const Articles = (props) => (
    props.articles.map((article) =>
        <div class="item">
            <i class="check circle teal icon"></i>
            <div class="content">
            <div class="header">Summary:</div>
            <div class="description">
                {this.props.cve.summary}
            </div>
            </div>
        </div>
    )
)


export default class NewsList extends Component {
    static propTypes = {
        cve: PropTypes.object.isRequired,
    }

    render () {
        <div class="ui small list">
            <Articles
                articles={}
            />
        </div>
    }
}