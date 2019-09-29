import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CVEs from '../Dto/CVEs';

/*
 * Displays details of one CVE.
 *
 * @author Alexander Koderman <attacksurface@koderman.de>
 * @export
 * @class CveDetails
 * @extends {Component}
 */
export default class CveDetails extends Component {

    static propTypes = {
        cve: PropTypes.object,
    };


    render () {
        if (!this.props.cve) {
          return (
             <div className='ui raised segment'>
                  <div className='ui center aligned grey icon header'>
                    <i class="grey info circle icon"></i>
                    <div className='content'>
                      Select a vulnerability...
                    </div>
                  </div>
              </div>
          );
        }

        const modified = CVEs.formatDate(this.props.cve.Modified);

        return(
            <div className='ui raised segment'>
                <div className='content'>
                  <div className='header'>{this.props.cve.id}</div>
                   <div class="ui small list">
                    <div class="item">
                    <span class="ui {CVEs.colorNameForScore(this.props.cve.cvss)} circular label">
                      {this.props.cve.cvss}
                    </span>
                    <span class="ui {CVEs.colorNameForScore(this.props.cve.cvss)} circular label">
                      {CVEs.severityForScore(this.props.cve.cvss)}
                    </span>
                    </div>
                    </div>
                    <div class="item"><i class="check circle red icon"></i>
                      <div class="content">
                        <a class="header">Published:</a>
                        <div class="description">Lorem ipsum.</div>
                      </div>
                    </div>
                    <div class="item"><i class="check circle red icon"></i>Modified: </div>
                    <div class="item"><i class="check circle red icon"></i>Weakness: </div>
                    <div class="item"><i class="check circle red icon"></i>Access:</div>
                    <div class="item"><i class="check circle red icon"></i>Impact:</div>
                    <div class="item"><i class="check circle red icon"></i>Vulnerable Product: </div>
                    <div class="item"><i class="check circle red icon"></i>Vulnerable Configuration: </div>
                    <div class="item"><i class="check circle red icon"></i>
                      {
                          this.props.cve.references.map( (reference, index) => {
                              return (
                                <div key={index} >
                                <a href={reference} target="_blank">{CVEs.getHostname(reference)}</a>
                                <br/>
                                </div>
                                );
                          })
                      }
                    </div>
                    <div class="item"><i class="check circle red icon"></i>{this.props.cve.summary}</div>




                 <div className='extra content'>
                    <span className='right floated edit icon'>
                      <i className='edit icon' />
                    </span>
                    <span className='right floated trash icon'>
                      <i className='trash icon' />
                    </span>
                  </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                  Start
                </div>
            </div>

        );
    }
}

/* card layout example:

<div class="visible content">
      <div class="ui card">
        <img class="ui image" src="http://mrg.bz/TRRrQJ">
        <div class="content">
          <div class="header">Pizza Margherita</div>
          <div class="description">Invented in Naples in honor of the first queen of Italy, the Margherita pizza is the triumph of Italian cuisine in the world.</div>
        </div>
        <div  class="extra content" >
          <div class="ui labeled icon menu">
            <a class="item"><i class="wait icon"></i>2h 16min</a>
            <a class="item"><i class="food icon"></i>6 servings</a>
            <a class="item"><i class="signal icon"></i>Easy</a>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden content">
      <div class="ui card">
      <div class="content">
        <div class="ui pointing secondary menu">
          <div class="item active" data-tab="ingredients">Ingredients</div>
          <div class="item" data-tab="directions">Directions</div>
        </div>
          <div class="ui tab active" data-tab="ingredients">
            <h3>For pasta</h3>
            <div class="ui list">
              <div class="item"><i class="check circle red icon"></i>2 lb Italian "00" flour or all-purpose flour</div>
              <div class="item"><i class="check circle red icon"></i>1 oz fresh yeast</div>
              <div class="item"><i class="check circle red icon"></i>2 cups water</div>
              <div class="item"><i class="check circle red icon"></i>⅜ oz salt</div>
            </div>
            <h3>For dressing</h3>
            <div class="ui small list">
              <div class="item"><i class="check circle red icon"></i>½ cup extra virgin olive oil</div>
              <div class="item"><i class="check circle red icon"></i>1 lb mozzarella cheese</div>
              <div class="item"><i class="check circle red icon"></i>basil leaves to taste</div>
              <div class="item"><i class="check circle red icon"></i>1 lb canned tomatoes</div>
              <div class="item"><i class="check circle red icon"></i>salt to taste</div>
            </div>
          </div>
          <div class="ui tab" data-tab="directions">
            <div class="ui small list">
              <div class="item"><span class="ui red circular label">1</span> On a wooden or marble work surface, shape the flour into a well. Place the yeast, salt and warm water in the center. Be caref
              */