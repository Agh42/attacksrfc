import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CVEs, NEWSWORTHY, HOTTOPIC} from '../Dto/CVEs';
import {Accordion, Icon} from 'semantic-ui-react';
import moment from 'moment';
import { deflateSync } from 'zlib';
import NewsList from '../Components/NewsList';



/*
 * Displays details of one CVE.
 *
 * @author Alexander Koderman <attacksurface@koderman.de>
 * @export
 * @class CveDetails
 * @extends {Component}
 */
 
const CVSS_CALCULATOR_URL = "https://cvssjs.github.io/#";

export default class CveDetails extends Component {
  
    state = { activeIndex: 0 }

    static propTypes = {
        cve: PropTypes.object.isRequired,
        articles: PropTypes.array.isRequired,
    };

    hasExploit = () => {
      if (!this.props.cve.references_tags) {
        return false;
      }
    
      return this.props.cve.references_tags
        .filter(tags => tags.some(tag => tag === 'Exploit'))
        .length > 0;
    }

    handleNewsClick = () => {
      this.setState({
        activeIndex: 1,
      });
    }

    handleAccordionClick = (e, titleProps) => {
      const { index } = titleProps
      const { activeIndex } = this.state
      const newIndex = activeIndex === index ? -1 : index
      this.setState({ activeIndex: newIndex })
    }

    /**
     * Returns index of tag list (outer array) containing 'exploit' tag:
     */
    indexOfExploitRef = () => {
      if (!this.props.cve.references_tags) {
        return -1;
      }

      return this.props.cve.references_tags
        .findIndex(tags => tags.some(tag => tag === 'Exploit'))
    }

    render () {
      const { activeIndex } = this.state

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
                style={{overflow: 'auto', "height":"52em"}}
            >
                <div className='ui segment'>
                <div class="ui large header">
                    <a href={"http://cve.mitre.org/cgi-bin/cvename.cgi?name="+this.props.cve.id} 
                        target="_blank" rel="noopener noreferrer" >
                        {this.props.cve.id}
                    </a>
                </div>

                <div class="ui link items">

                  { (this.hasExploit()) ? (
                    <a class="link item"
                      target="_blank" rel="noopener noreferrer"  
                      href={this.props.cve.references[this.indexOfExploitRef()]} >
                      <div class="middle aligned content">
                        <i class="huge warning sign red link icon"></i>
                        <div class="ui red header">
                          Exploit warning
                        </div>
                      </div>
                    </a>
                  ) : ""
                  }

                  {
                    (() => {
                        if (CVEs.hasNews(this.props.cve)) {
                          return  <a class="link item"
                            target="_blank" rel="noopener noreferrer"  
                            onClick={this.handleNewsClick} >
                            <div class="middle aligned content">
                              <i class="huge comments orange link icon"></i>
                              <div class="ui orange header">
                                Newsworthy
                              </div>
                            </div>
                          </a>
                        }
                    })()
                  }

                  { (() => {
                      if (CVEs.hasNews(this.props.cve) === HOTTOPIC) {
                            return  <a class="link item"
                              target="_blank" rel="noopener noreferrer"  
                              onClick={this.handleNewsClick} >
                              <div class="middle aligned content">
                                <i class="huge fire red link icon"></i>
                                <div class="ui red header">
                                  Hot Topic
                                </div>
                              </div>
                            </a>
                      }
                    })()
                  }

                    <a class="link item"
                      target="_blank" rel="noopener noreferrer"  
                      href={CVSS_CALCULATOR_URL + this.props.cve["cvss-vector"]} >
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
                    </a>

                  {('cvssv3_score' in this.props.cve
                    && this.props.cve.cvssv3_score > 0 ) 
                    ? (
                    <a class="link item"
                      target="_blank" rel="noopener noreferrer"  
                      href={
                        ('vectorString' in this.props.cve.cvssv3) 
                        ? CVSS_CALCULATOR_URL + this.props.cve.cvssv3.vectorString
                        : ""
                      } >
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
                    </a>
                  ) : ""}
                 </div>
                 </div>
                 

                   <div class="ui segment">
                   <Accordion>
                      <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name='dropdown' />
                        Vulnerability Details
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 0}>
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
                      </Accordion.Content>

                      <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name='dropdown' />
                        News Items
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 1}>
                       <NewsList
                         articles={this.props.articles}
                       />
                      </Accordion.Content>
                   </Accordion>

                 
            </div>
          </div>
        );
    }
}