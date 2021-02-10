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
                            Access to over 330.000 product identifiers and more than 157.000 vulnerabilities.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content"><strong>Save your inventory</strong> (Free tier limited 
                          to 1 inventory with 10 products)</div>
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
                          <div class="content">
                            <strong>Email notifications</strong> on vulnerabilities and news monitoring
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Free - thanks to our principal sponsor: <a class="item" target="_blank" rel="noopener noreferrer" 
                            href="https://SerNet.de">SerNet.de</a>.
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
                    <div class="centered header">PRO - Individual</div>
                    <span class="ui orange right corner label"><i className="star icon" /></span>
                    <span class="ui yellow ribbon label">Special offer</span>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Access to over 330.000 product identifiers and more than 157.000 vulnerabilities.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Manage <strong>10 inventories with up to 50 products each</strong>.
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
                            You get the sponsor role in the discord chat.
                          </div>
                        </div>

                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            You support open source software and help us to pay
                            for cloud computing and storage.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="https://www.patreon.com/CSTOOL_io" target="_blank" rel="noopener noreferrer"
                     class="ui positive button">
                    <i class="arrow alternate circle up icon"></i>
                    Sign up with Patreon...
                  </a>
                </div>

                <div class="raised card">
                  <div class="content">
                    <div class="centered header">PRO - Corporate</div>
                    <div class="ui hidden divider"></div>
                    <div class="description">
                      <div class="ui list">
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Access to over 330.000 product identifiers and more than 157.000 vulnerabilities.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            Manage <strong>100 inventories with up to 100 products each</strong>.
                          </div>
                        </div>
                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            May be used <strong>for up to 10 users</strong>.
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
                            You get the sponsor role in the discord chat.
                          </div>
                        </div>

                        <div class="item">
                          <i class="check circle icon"></i>
                          <div class="content">
                            You support open source software and help us to pay
                            for cloud computing and storage.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="https://www.patreon.com/CSTOOL_io" target="_blank" rel="noopener noreferrer" 
                     class="ui positive button">
                    <i class="arrow alternate circle up icon"></i>
                    Sign up with Patreon...
                  </a>
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
                          <div class="content">You can use all of those for free (free as in free beer) under the terms of the <a href="/legal.html" >GNU AGPL and other licenses.</a></div>
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
                          <div class="content">If you consider sponsoring the project (using any of the Patreon links 
                          provided) it will be greatly appreciated! Even if you don't intend to use the public cloud service.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="https://github.com/Agh42/CSTOOL_io" target="_blank" rel="noopener noreferrer"
                     class="ui button">
                    <i class="github icon"></i>
                    Go to GitHub
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="ui center aligned grid">
          <div class="column">
            <div class="content">
              Want to deploy on-premise or in a private cloud? If you need to run a professionally supported on-premise or private-cloud
              installation, feel free to get in touch to discuss options:&nbsp;
              <a href="mailto:info@cstool.io">
                    <i class="phone icon"></i>
                    Get in touch
              </a>
            </div>
            <Link to="/">Go back.</Link>
                           </div>
        </div>


      </React.Fragment>
    );
  }
}
export default withAuth0(RegisterPage);