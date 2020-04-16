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

    hasExploit = () => {
      if (!this.props.cve.references_tags) {
        return false;
      }
    
      return this.props.cve.references_tags
        .filter(tags => tags.some(tag => tag === 'Exploit'))
        .length > 0;
    }

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
            <div className='ui raised segments'
                style={{overflow: 'auto', "height":"38em"}}
            >
                <div className='ui segment'>
                <div class="ui large header">
                    <a href={"http://cve.mitre.org/cgi-bin/cvename.cgi?name="+this.props.cve.id} 
                        target="_blank" rel="noopener noreferrer" >
                        {this.props.cve.id}
                    </a>
                </div>

                
xxx
                <div class="ui small list">
                  { (this.hasExploit()||true) ? (
                    <div class="item"><i class="huge warning sign red link icon"></i>
                          <div class="content">
                            <div class="large middle aligned header">
                              Exploit warning!
                            </div>
                          </div>
                    </div>
                    
                  ) : ""
                  }

                  <div class="item">
                      <div class="content">
                      <div class="header">
                      CVSSv2&nbsp;
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvss) + " circular label"}>
                        {this.props.cve.cvss}
                      </div>&nbsp;
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvss) + " circular label"}>
                        {CVEs.severityForScore(this.props.cve.cvss)}
                      </div>
                      </div>
                      </div>
                   </div>

                  {('cvssv3_score' in this.props.cve) ? (
                   <div class="item">
                      <div class="content">
                      <div class="header">
                      CVSSv3&nbsp;
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvssv3_score) + " tiny circular label"}>
                        {this.props.cve.cvssv3_score}
                      </div>&nbsp;
                      <div class={"ui " + CVEs.colorNameForScore(this.props.cve.cvssv3_score) + " tiny circular label"}>
                        {CVEs.severityForScore(this.props.cve.cvss3_score)}
                      </div>
                   </div>
                 </div>
                 </div>
                  ) : ""}
                 </div>
                 </div>
                 

                   <div class="ui segment">
                   <div class="ui small list">
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                          <div class="header">
                            Published: {CVEs.formatDate(this.props.cve.Published)}
                          </div>
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
                        <div class="header">Summary:</div>
                        <div class="description">
                            {this.props.cve.summary}
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">
                        {('cwe' in this.props.cve 
                          && this.props.cve.cwe.match(/CWE-(\d+)/) )? (
                          <span>
                          Weakness: <a target="_blank" rel="noopener noreferrer"  href={"https://cwe.mitre.org/data/definitions/"
                            + this.props.cve.cwe.match(/CWE-(\d+)/)[1] + ".html"}>
                              {this.props.cve.cwe}
                            </a>
                          </span>
                        ) : "Weakness: -"
                        }
                        </div>
                        </div>
                      </div>

                      <div class="item"><i class="check circle teal icon"></i>
                      <div class="content">
                        <div class="header">References:</div>
                        <div class="description">
                        {
                            this.props.cve.references
                            ? this.props.cve.references.map( (reference, index) => {
                                return (
                                  <div key={index} >
                                  <a href={reference} target="_blank" rel="noopener noreferrer" >{CVEs.getHostname(reference)}</a>
                                  <br/>
                                  </div>
                                  );
                              })
                            : ""
                        }
                        </div>
                      </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">Access:</div>
                        <div class="description">
                          {'access' in this.props.cve ? (
                            <span>
                              <div>Vector: {this.props.cve.access.vector}</div>
                              <div>Complexity: {this.props.cve.access.complexity}</div>
                              <div>Authentication: {this.props.cve.access.authentication}</div>
                            </span>
                          ) : ""
                          }
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">Impact:</div>
                        <div class="description">
                        {'impact' in this.props.cve ? (
                          <span>
                            <div>Confidentiality: {this.props.cve.impact.confidentiality}</div>
                            <div>Integrity: {this.props.cve.impact.integrity}</div>
                            <div>Availability: {this.props.cve.impact.availability}</div>
                          </span>
                        ) : ""
                        }
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                        <div class="header">Vulnerable Product: </div>
                        <div class="description">
                           { 'vulnerable_product' in this.props.cve ? (
                                this.props.cve.vulnerable_product.map( (vp, index) => {
                                  return (
                                    <div key={index} >
                                    {vp}
                                    <br/>
                                    </div>
                                  );
                                })
                              ) : ""
                            }
                        </div>
                        </div>
                      </div>
                      
                      <div class="item"><i class="check circle teal icon"></i>
                        <div class="content">
                          <div class="header">Vulnerable Configuration:</div>
                            <div class="description">
                              {
                                'vulnerable_configuration' in this.props.cve ? (
                                    this.props.cve.vulnerable_configuration.map( (vc, index) => {
                                        return (
                                          <div key={index}>
                                            {vc}
                                          </div>
                                        ); 
                                    })
                                ) : ""
                              }
                            </div>
                          </div>
                      </div>
                      
                    
                </div>
            </div>
          </div>
        );
    }
}