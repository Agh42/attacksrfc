import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class PricingPage extends Component {
    render() {
        return (
                <React.Fragment>
            <div class="ui middle aligned stackable grid container">
                <div class="row">
                  <div class="sixteen wide column">
                      <div class="ui two centered cards">
                      
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
                              <span class="ui orange right corner label"><i className="star icon" /></span>
                              <span class="ui yellow ribbon label">Coming soon</span>
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
                                               Email notifications when new vulnerabilities for your asset inventory are found
                                              </div>
                                          </div>
                                          <div class="item">
                                          <i class="check circle icon"></i>
                                          <div class="content">
                                          All data is stored on secure cloud infrastructure in the European 
                                          Union. The CSTOOL.io source code is fully disclosed as open source.
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