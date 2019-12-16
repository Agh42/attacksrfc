import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class PricingPage extends Component {
    render() {
        return (
                <React.Fragment>
            <div class="ui middle aligned stackable grid container">
                <div class="row">
                  <div class="sixteen wide column">
                      <div class="ui four centered cards">
                      
                         <div class="raised card">
                         
                            <div class="content">
                              <div class="centered header">Free</div>
                              <div class="description">
                                  <div class="ui list">
                                      <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">Inventory and Vulnerability Search</div>
                                      </div>
                                      <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">Vulnerability Landscape View</div>
                                      </div>
                                      <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">Limited requests</div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                            <a href="/attacksrfc" class="ui disabled button">
                              Free
                            </a>
                          </div>
                          
                           <div class="raised card">
                            <div class="content">
                              <div class="centered header">Personal Account</div>
                              <div class="description">
                                   <div class="ui list">
                                            <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Access to over 99.900 products and more than 196.000 vulnerabilities.
                                              </div>
                                          </div>
                                   
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Increased request limit
                                              </div>
                                          </div>
                                         
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                                Save your inventory of assets
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Assign mitigation tasks using email / JIRA / Slack integration
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                               Full mitigation roundtrip workflow
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                               Email notifications when new vulnerabilities for your asset inventory are found
                                              </div>
                                          </div>
                                          <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                          Your data is stored on highly secure cloud infrastructure in the European Union and the CSTOOL.io source code is fully disclosed as open source.
                                          </div>
                                        </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                               <b>New accounts are currently not available publicly. Check the subreddit or chat 
                                               to follow eventual updates.</b>
                                              </div>
                                          </div>
                                   </div>
                              </div>
                            </div>
                            <Link to="/register" class="ui disabled button">
                              <i class="shopping cart icon"></i>
                              Unavailable, sorry.
                            </Link>
                          </div>
                          
                           <div class="raised card">
                            <div class="content">
                              <div class="centered header">Professional</div>
                              <span class="ui orange right corner label"><i className="star icon" /></span>
                              <span class="ui yellow ribbon label">Commercial usage</span>
                              <div class="description"> 
                                  <div class="ui list">
                                   <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Access to over 99.900 products and more than 196.000 vulnerabilities.
                                              </div>
                                          </div>
                                   
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Unlimited requests
                                              </div>
                                          </div>
                                         
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                                Save your inventory of assets
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                              Assign mitigation tasks using email / JIRA / Slack integration
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                               Full mitigation roundtrip workflow
                                              </div>
                                          </div>
                                          <div class="item">
                                              <i class="check circle icon"></i>
                                              <div class="content">
                                               Alerts when new vulnerabilities for your asset inventory occur
                                              </div>
                                          </div>
                                         <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                          Your data is stored on continuosly audited and highly secure cloud infrastructure. Our software is developed under secure coding guidelines and fully disclosed as open source.
                                          </div>
                                        </div>
                                        <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                            <b>42,-€ per month</b><br/>(billed yearly)
                                          </div>
                                        </div>
                                        <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                           <b>Save 20%</b> 
                                          </div>
                                        </div>
                                        <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                           <b>Exclusive offer: Activate a second CSTOOL.io tool for free!</b>
                                          </div>
                                        </div>
                                  </div>
                              </div>
                            </div>
                            <Link to="/register" class="ui bottom attached positive button">
                              <i class="percent icon"></i>
                              Try 30 days for free
                            </Link>
                          </div>
                          
                           <div class="raised card">
                            <div class="content">
                              <div class="centered header">On-Premise / Private Cloud</div>
                              <div class="description">
                               <div class="ui list">
                                    <div class="item">
                                      <i class="check circle icon"></i>
                                      <div class="content">
                                       Run AttackSurface in your local data center or any public or private cloud.
                                      </div>
                                    </div>
                                    <div class="item">
                                      <i class="check circle icon"></i>
                                      <div class="content">
                                      Our offer for highly regulated and highly sensitive companies.
                                      </div>
                                    </div>
                                    <div class="item">
                                      <i class="check circle icon"></i>
                                      <div class="content">
                                        Complete access to our docker repository - run the same up-to-date versions of alls CSTOOL.io tools in your own environment.
                                      </div>
                                    </div>
                                    <div class="item">
                                      <i class="check circle icon"></i>
                                      <div class="content">
                                        Support and professional services to integrate AttackSurface in your environment.
                                      </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                            <a href="/askquote" class="ui bottom attached positive button">
                              <i class="phone icon"></i>
                              Ask for Quote
                            </a>
                          </div>
                          
                      </div>
                  </div>
                </div>
              </div>
              
                       <div class="ui center aligned grid">
                           <div class="column">
                           <Link to="/login">Login</Link> with existing account or <Link to="/">go back</Link>.
                           </div>
                       </div>
                
              
                      </React.Fragment>
        );
    }
}