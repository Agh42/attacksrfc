import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';

class RegisterPage extends Component {
  render() {

    const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout, 
    } = this.props.auth0;

    return (
      <React.Fragment>
        <div class="ui middle aligned grid container">
          <div class="row">
            <div class="sixteen wide column">
              <div class="ui stackable four centered cards">

                <div class="raised card">
                  <div class="content">
                    <div class="centered header">Free</div>
                    <div class="ui hidden divider"></div>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Access to over 326.000 product identifiers and more than 151.000 vulnerabilities.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">Vulnerability-search and graph view</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">Hot-topics view</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content"><strong>Save your inventory</strong> (Free tier limited 
                          to two inventories with ten products each)</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            <strong>Email notifications</strong> on vulnerabilities and news monitoring
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a class="ui positive button"
                       onClick={() => loginWithRedirect()} >
                    <i class="hat wizard icon"></i>
                    Sign up / Sign in - it's free!
                  </a>
                </div>

                <div class="raised card">
                  <div class="content">
                    <div class="centered header">Sponsor</div>
                    <span class="ui orange right corner label"><i className="star icon" /></span>
                    <span class="ui yellow ribbon label">Coming soon</span>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Access to over 326.000 product identifiers and more than 151.000 vulnerabilities.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">Vulnerability search and graph view</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">Hot-topics view</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Personal login
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Multiple inventories with up to 100 products each.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Save and manage multiple inventories
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            All data is stored on secure cloud services in the European Union.
                                              </div>
                        </div>

                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            <strong>Email notifications</strong> on vulnerabilities and news monitoring
                          </div>
                        </div>

                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            You get the sponsor role in the chat.
                                              </div>
                        </div>

                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            By becoming a sponsor you support open source software and help us to pay
                            for cloud computing and storage.
                                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            <b>Sponsor accounts are not yet available publicly. Check the subreddit or chat
                                               to follow eventual updates.</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/register" class="ui disabled button">
                    <i class="arrow alternate circle up icon"></i>
                    Coming soon.
                            </Link>
                </div>

                <div class="raised card">
                  <div class="content">
                    <div class="centered header">Community</div>
                    <div class="ui hidden divider"></div>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            CSTOOL.io is free and open-source software (free as in freedom).
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">The source code is available on GitHub and Bitbucket.</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">Up-to-date docker containers of all components can be downloaded on Docker Hub.</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">You can use all of those for free (free as in beer) under the terms of the <a href="/legal.html" >GNU AGPL and other licenses.</a></div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">CSTOOL.io is privately maintained and receives no public funding. We also do not sell user data.</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">The income from sponsor accounts helps to cover the operating costs and ensure further development of CSTOOL.io.</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">If you just want to use the freely available features or downloadable containers, that is fine and we'd be happy to receive any feedback or contributions you might have.</div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">However if you consider sponsoring the project we will greatly appreciate that - even if you don't intend to use the public cloud service.</div>
                        </div>


                       

                      </div>
                    </div>
                  </div>
                  <a href="https://github.com/Agh42/CSTOOL_io" class="ui button">
                    <i class="github icon"></i>
                    Go to GitHub
                  </a>
                </div>

                <div class="raised card">
                  <div class="content">
                    <div class="centered header">On-Premise / Private Cloud</div>
                    <div class="ui hidden divider"></div>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            If you need to run a professionally supported on-premise or private-cloud
                            installation, feel free to get in touch to discuss options.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="mailto:info@cstool.io" class="ui button">
                    <i class="phone icon"></i>
                    Ask for quote
                  </a>
                </div>



              </div>
            </div>
          </div>
        </div>

        <div class="ui center aligned grid">
          <div class="column">
            <Link to="/">Go back.</Link>
                           </div>
        </div>


      </React.Fragment>
    );
  }
}
export default withAuth0(RegisterPage);