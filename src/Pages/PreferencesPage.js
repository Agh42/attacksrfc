import React, { Component } from 'react';
import LinkToLogin from '../Components/LinkToLogin';
import { withAuth0 } from '@auth0/auth0-react';
import { Button, Icon, Checkbox, Form, Message } from 'semantic-ui-react'
import {Link, Redirect} from 'react-router-dom';
import AccountClient from '../Gateways/AccountClient';

// page load redirects:
const REDIRECT_HOME= 'REDIRECT_HOME';

const CLEAN = "save_ready";
const DIRTY = "save_dirty";
const SAVED = "save_success";
const NOTSAVED = "save_error";

const saveSuccessMessage = (props) => (
  <Message
    icon='inbox'
    header='Saved!'
    content='Your account was successfully saved.'
  />
)

class PreferencesPage extends Component {

  state = {
    _redirect: "",
    _saveStatus: CLEAN,
    account: {},
  };

  componentDidMount() {
    this.loadAccount();
  } 

  componentDidUpdate() {
    switch (this.state._saveStatus) {
      case SAVED:
        setTimeout(() => {
            this.setState({_saveStatus: CLEAN});
        }, 2000);
        break;
      default:
          break;
    }
  }

  loadAccount = () => {
    const {getAccessTokenSilently} = this.props.auth0;
    getAccessTokenSilently().then(
      this.callApiGetAccount
      );
  }

  callApiGetAccount = (token) => {
    AccountClient.getAccount( 
      (account) => {
      this.setState({
        account: account,
        _saveStatus: CLEAN,
      })
    }, token);
  }

  handleCancelClick = () => {
    this.setState({_redirect: REDIRECT_HOME});
  }

  handleDeleteClick = () => {
    console.log("Delete account selected")
  }

  handleSaveClick = () => {
    const {getAccessTokenSilently} = this.props.auth0;
    getAccessTokenSilently().then(
      this.callApiSaveAccount
    );
  }

  callApiSaveAccount = (token) => {
    AccountClient.saveAccount(
      this.saveSuccessful, 
      this.state.account, 
      token);
  }

  saveSuccessful = () => {
    this.setState({_saveStatus: SAVED});
  }

  togglePrefValue = (e, {value} ) => {
    if (!('preferences' in this.state.account))
      return;

    const newPreferences = this.state.account.preferences;
    newPreferences[value] = !newPreferences[value];
    this.setState({
      account: {...this.state.account, preferences: newPreferences},
      _saveStatus: DIRTY,
    });

  }

  /* onInputChange = ({ name, value, error }) => {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;
    console.log("name_error:" + name+"_"+error);
    console.log("name_value:" + name+"_"+value);

    this.setState({ fields, fieldErrors });
}; */

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
                    {this.state._saveStatus === SAVED ? saveSuccessMessage : ""}
                    <div className='ui centered grid'>
                        <div className='one column row'>
                            <div className='eight wide column'>

                            <div class="ui form">

                              <Button.Group attached="top">
                                <Button positive animated='fade'
                                    disabled={!(this.state._saveStatus === DIRTY)}
                                    onClick={this.handleSaveClick}>
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
                                    onClick={this.handleDeleteClick}>
                                    <Button.Content hidden>Delete Account</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='trash' />
                                    </Button.Content>
                                </Button>
                              </Button.Group>

                              <h4 class="ui dividing header">Your profile (read-only)</h4>
                              
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
                                  <Checkbox 
                                    toggle 
                                    label='E-mail notifications for hot topics' 
                                    value='notificationsHotTopics'
                                    checked={(this.state.account.preferences||{}).notificationsHotTopics}
                                    onChange={this.togglePrefValue}
                                    />
                                </Form.Field>
                                <Form.Field>
                                  <Checkbox 
                                    toggle 
                                    label='E-mail notifications for inventories (master switch)' 
                                    value='notificationsInventories'
                                    checked={(this.state.account.preferences||{}).notificationsInventories}
                                    onChange={this.togglePrefValue}
                                    />
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
                                <div class="header">You have the following subscriptions:</div>
                                <ul class="list">
                                  <li>[No subscriptions]</li>
                                </ul>
                              </div>

                                <Button.Group attached="top">
                                  <Button positive animated='fade'
                                      disabled={!(this.state._saveStatus === DIRTY)}
                                      onClick={this.handleSaveClick}>
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
                                      onClick={this.handleDeleteClick}>
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