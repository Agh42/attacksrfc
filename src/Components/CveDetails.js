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
        cve: PropTypes.object.isRequired,
    };


    render () {
        if (! ('id' in this.props.cve)) {
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
            <div className='ui raised segments'>
                <div className='ui segment'>
                <div class="ui large header">
                    <a href={"http://cve.mitre.org/cgi-bin/cvename.cgi?name="+this.props.cve.id} 
                        target="_blank">
                        {this.props.cve.id}
                    </a>
                </div>
                  <div class="item">
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvss) + " circular label"}>
                        {this.props.cve.cvss}
                      </div>&nbsp;
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvss) + " circular label"}>
                        {CVEs.severityForScore(this.props.cve.cvss)}
                      </div>
                   </div>
                 </div>

                   <div class="ui segment">
                   <div class="ui small list">
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                          <div class="header">Published: {CVEs.formatDate(this.props.cve.Published)} </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                          Modified: {CVEs.formatDate(this.props.cve.Modified)}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        Weakness: {this.props.cve.cwe}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        Access:{this.props.cve.access}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        Impact:{this.props.cve.impact}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        Vulnerable Product: {this.props.cve.vulnerable_product}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        Vulnerable Configuration: {this.props.cve.vulnerable_configuration}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                      <div class="content">
                        <div class="header">References:</div>
                        <div class="description">
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
                      </div>
                      
                      </div>

                      <div class="item"><i class="check circle teal icon"></i>
                      <div class="content">
                        <div class="header">Summary:</div>
                        <div class="description">
                        {this.props.cve.summary}
                        </div>
                        </div>
                      </div>
                </div>
            </div>
            </div>
        );
    }
}
