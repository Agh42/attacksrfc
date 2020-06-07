import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon, Dropdown} from 'semantic-ui-react'

function toOptions(cves, onClick) {
    return cves.map((cve) =>
        { return {key: cve, text: cve, value: cve,  onClick: onClick} }
    );
}

const Articles = (props) => (
    props.articles.map((article) =>
        <div class="item">
            <div class="content">
                <div class="header">
                    {(article.region)
                    ? <i class={article.region + " flag"}></i>
                    : <i class="newspaper icon"></i>
                    }
                    <a target="_blank" rel="noopener noreferrer"  
                        href={article.url}>{article.name}
                    </a>
                </div>
                <div class="meta">
                    <a target="_blank" rel="noopener noreferrer"  
                        href={"https://translate.google.com/translate?js=n&sl=auto&tl=en&u="
                        + article.url}>
                        <span class="ui blue text">[View Translation...]</span>
                    </a>
                </div>
                <div class="description">
                    <span class="ui grey text">{article.provider}:</span> {article.description}...
                </div>
                <div class="extra">
                    <div class="ui text">Published: {formatDateTime(article.datePublished)}</div>
                    
                    <Dropdown
                        className="primary right floated"
                        selection
                        floating
                        text='Mentioned CVEs...'
                        options={toOptions(article.cvesMentioned, props.onCveSelected)}
                    />
                    {/*
                    <Button className="primary right floated" animated='fade'
                        onClick={buttonClicked(article.cvesMentioned)}>
                        <Button.Content hidden>Add...</Button.Content>
                        <Button.Content visible>
                            <Icon name='plus' />
                        </Button.Content>
                    </Button>
                    */}
                </div>
            </div>
        </div>
    )
)

function formatDateTime(isoDate) {
    let mom = moment(isoDate, moment.ISO_8601, true);
    return mom.format('YYYY-MM-DD HH:mm (UTC Z)');
}

export default class NewsList extends Component {
    static propTypes = {
        articles: PropTypes.array.isRequired,
        onCveSelected: PropTypes.func.isRequired,
    }

    onCveSelected = (ev, props) => {
        this.props.onCveSelected(props.value);
    }

    render () {
        if (! ('articles' in this.props) 
            || (!this.props.articles) 
            || (this.props.articles.length < 1)
            ) {
            return( 
                <div className='ui center aligned grey icon header'>
                    <i class="grey pencil circle icon"></i>
                    <div className='content'>
                        No news is good news.
                    </div>
                </div>
            );
        }

        return (
            <div class="ui divided items">
                <Articles
                    articles={this.props.articles}
                    onCveSelected={this.onCveSelected}
                />
            </div>
        )
    }
}