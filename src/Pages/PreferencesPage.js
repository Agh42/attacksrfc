import React, { Component } from 'react';
import LinkToLogin from '../Components/LinkToLogin';
import { withAuth0 } from '@auth0/auth0-react';
import { Button, Icon, Checkbox, Form } from 'semantic-ui-react'
import {Link, Redirect} from 'react-router-dom';

// page load redirects:
const REDIRECT_HOME= 'REDIRECT_HOME';


class PreferencesPage extends Component {

  state = {
    _redirect: "",
  };

  componentDidMount() {
    this.loadAccount();
  } 

  loadAccount = () => {
    // TODO load account mathcing extid from service with token
  }

  handleCancelClick = () => {
    this.setState({_redirect: REDIRECT_HOME});
  }

  handleSaveClick = () => {
    // TODO save account with auth0 token
  }

  render() {
    if (this.state._redirect) {
      return {
          REDIRECT_HOME: <Redirect to='/' />
      }[this.state._redirect];
  }

    const {
      isLoading,
      isAuthenticated,
      error,
      user,
      loginWithRedirect,
      logout, 
    } = this.props.auth0;

    return (
      <div class="ui fluid container">
        <div class="ui padded grid">
                <div class="one column row">
                    <div class="sixteen wide column">
                      <div class="ui top fixed inverted teal icon menu"
                          style={{overflow: 'auto'}}
                      >
                          <a className="item" href="/"><i className="caret left icon" /></a>
                          <div className="ui item"><h4 className="ui left aligned inverted header">
                              AttackSrfc - CVE Search and Vulnerability Management
                              <div className="sub header">
                              Your profile
                              </div>
                              </h4>
                          </div>
                          <div class="right menu primary">
                          <LinkToLogin/>
                          </div>
                      </div>
                    </div> {/* end col */}
                </div> {/* end row */}
                <div class="row">
                  <div class="sixteen wide column">
                    <div className='ui centered grid'>
                        <div className='one column row'>
                            <div className='eight wide column'>

                            <div class="ui form">
                              <h4 class="ui dividing header">Your profile</h4>
                              <div class="ui message">
                                <div class="content">Your profile information is synchronized with your identity provider.
                                It cannot be changed here. If it is not up to date, try signing out and back in again.</div>
                              </div>
                              <div class="two fields">
                                <div class="field">
                                  <label>Avatar</label>
                                  <img class="ui avatar image" src={user.picture}></img>
                                </div>
                                <div class="field">
                                  <label>Nickname</label>
                                  <input type="text" readOnly value={user.nickname}></input>
                                </div>
                              </div>
                              <div class="two fields">
                                <div class="field">
                                  <label>Email</label>
                                  <input type="text" readOnly value={user.email}></input>
                                </div>
                                <div class="field">
                                  <label>Name</label>
                                  <input type="text" readOnly value={user.name}></input>
                                </div>
                              </div>

                              <h4 class="ui dividing header">Preferences</h4>
                              <div class="ui segment">
                                <Form.Field>
                                  <Checkbox toggle label='Enable email notifications (master switch)' />
                                </Form.Field>
                                <Form.Field>
                                  <Checkbox toggle label='Enable notifications for hot topics' />
                                </Form.Field>
                              </div>

                              <h4 class="ui dividing header">Inventories</h4>
                              <div class="ui message">
                                <div class="header">You have saved the following inventories:</div>
                                <ul class="list">
                                  <li>[No saved inventories]</li>
                                </ul>
                              </div>

                              <h4 class="ui dividing header">Invites</h4>
                              <div class="ui message">
                                <div class="header">You have invited the following users to your organization:</div>
                                <ul class="list">
                                  <li>[No invites]</li>
                                </ul>
                              </div>

                              <h4 class="ui dividing header">Subscriptions</h4>
                              <div class="ui message">
                                <div class="content">You have no paid subscriptions.</div>
                                
                              </div>
                               

                                <Button.Group attached="top">
                                  <Button positive animated='fade'
                                      onClick={this.props.handleSaveClick}>
                                      <Button.Content hidden>Save</Button.Content>
                                      <Button.Content visible>
                                          <Icon name='save' />
                                      </Button.Content>
                                  </Button>
                                  <Button animated='fade'
                                      onClick={this.handleCancelClick}>
                                      <Button.Content hidden>Cancel</Button.Content>
                                      <Button.Content visible>
                                          <Icon name='caret left' />
                                      </Button.Content>
                                  </Button>
                                  <Button negative animated='fade'
                                      onClick={this.props.handleDeleteClick}>
                                      <Button.Content hidden>Delete Account</Button.Content>
                                      <Button.Content visible>
                                          <Icon name='trash' />
                                      </Button.Content>
                                  </Button>
                                </Button.Group>
                            </div>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
          </div>
         
          </div>
          
    );
  }
}
export default withAuth0(PreferencesPage);