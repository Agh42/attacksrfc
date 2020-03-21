import React, { Component } from 'react';
import PropTypes from 'prop-types';



export default class CveGraph extends Component {

    onClick = () => {
        this.setState({
            _cookieMnomMnom: true,
        });
        localStorage.setItem('cookieMnomMnom', true);
    }

    constructor() {
        super();
        this.state = {
            _cookieMnomMnom: localStorage.getItem('cookieMnomMnom'),
        }
    }

    render() {
        return (
            this.state._cookieMnomMnom
            ? ""
            : <div class="middle aligned item ">
              <div class="ui large black right pointing label">
                    This site uses cookies. <a class="content" href="/legal.html"> Learn more.</a>
                
              </div>
                <button class="pink ui button"
                    onClick={this.onClick} >
                    <i class="checkmark icon"></i> Okay!
                </button>
            </div>
        )
    }



}

