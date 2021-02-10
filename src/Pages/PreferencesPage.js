import React, { Component } from 'react';
import LinkToLogin from '../Components/LinkToLogin';
import { withAuth0 } from '@auth0/auth0-react';
import { Button, Icon, Checkbox, Form, Confirm, Modal } from 'semantic-ui-react'
import {Link, Redirect} from 'react-router-dom';
import AccountClient from '../Gateways/AccountClient';
import VoucherForm from '../Components/VoucherForm';
import { declareExportDeclaration } from '@babel/types';
import store from 'store';

// page load redirects:
const REDIRECT_HOME= 'REDIRECT_HOME';

const CLEAN = "save_ready";
const DIRTY = "save_dirty";
const SAVED = "save_success";
const SAVING = "save_working";

const Subscriptions = (props) => (
  <div class="ui list">
    {
    props.subscriptions.map( (sub) =>
      <div class="item">
        <i class="arrow alternate circle up icon"></i>
        <div class="content">
          <div class="header">
          {sub.name}
          </div>
          <div class="description">
          Grants {sub.maxInventories} inventories with {sub.maxProductsPerInventory} products each.
          </div>
        </div>
      </div>
    )
    }
  </div>
)

const Inventories = (props) => (
  <div class="ui list">
    {
    props.inventories.map( (inv) =>
      <div class="item">
        <i class="archive icon"></i>
        <div class="content">
          <div class="header">
          {inv.name}
          </div>
          <div class="description">
          Notifications are {inv.notify ? 'On' : 'Off'}. Contains {inv.products.length} products.
          </div>
        </div>
      </div>
    )
    }
  </div>
)

class PreferencesPage extends Component {

  state = {
    _redirect: "",
    _saveStatus: CLEAN,
    _showConfirm: false,
    account: {},
    _voucherModalOpen: false,
    voucher: "",
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
      this.callApiGetOrCreateAccount
      );
  }

  callApiGetOrCreateAccount = (token) => {
    AccountClient.getAccount( 
        (account) => {
        this.setState({
          account: account,
          _saveStatus: CLEAN,
        })
      }, token)
      .catch (error => {
        // try to create account:
        AccountClient.saveAccount(
          this.loadAccount, 
          this.state.account, 
          token,
          true);
        });
  }

  handleCancelClick = () => {
    this.setState({_redirect: REDIRECT_HOME});
  }

  handleDeleteClick = () => {
    console.log("Delete account selected")
    this.setState({_showConfirm: true});
  }

  handleSaveClick = () => {
    this.setState({_saveStatus: SAVING});
    const {getAccessTokenSilently} = this.props.auth0;
    getAccessTokenSilently().then(
      this.callApiSaveAccount
    );
  }


  callApiSaveAccount = (token) => {
    AccountClient.saveAccount(
      this.saveSuccessful, 
      this.state.account, 
      token,
      true);
  }

  callApiDeleteAccount = (token) => {
    AccountClient.deleteAccount(
      this.saveSuccessful, 
      this.state.account, 
      token);
  }

  saveSuccessful = () => {
    this.setState({
      _saveStatus: SAVED,
      _redirect: REDIRECT_HOME
    });
  }

  togglePrefValue = (e, {value} ) => {
    var newPreferences = this.state.account.preferences||{};
    newPreferences[value] = (value in newPreferences) ? !newPreferences[value] : true;
    this.setState({
      account: {...this.state.account, preferences: newPreferences},
      _saveStatus: DIRTY,
    });

  }

  handleDialogCancel = () => {
    this.setState({_showConfirm: false});
  }

  handleDialogConfirm = () => {
    this.setState({_saveStatus: SAVING});
    const {getAccessTokenSilently} = this.props.auth0;
    getAccessTokenSilently().then(
      this.callApiDeleteAccount
    );
    const {logout} = this.props.auth0;
    logout({returnTo: window.location.origin});
  }

  logout = () => {
    store.set('selectedCpes', []);
    store.set('stepsDisabled', false);
    const {logout} = this.props.auth0;
    logout({returnTo: window.location.origin});
  }

  closeVoucherModal = () => {
    this.setState({_voucherModalOpen: false});
  }

  handleVoucherSubmit = (code) => {
    this.setState({
      _voucherModalOpen: false,
      voucher: code,
    });
    this.loadAccount();
  }

  handleRedeemVoucherClick = (e, data) => {
    e.preventDefault();
    this.setState({_voucherModalOpen: true});
  }

  render() {
    if (this.state._redirect) {
      return {
          REDIRECT_HOME: <Redirect to='/' />
      }[this.state._redirect];
    }

    const {
      user
    } = this.props.auth0;

    return (
      <div class="ui fluid container">
       <Confirm
          open={this.state._showConfirm}
          header='Completely remove your account?'
          content='This will remove your account, your inventories and all related information. This is final 
            and cannot be undone. For technical reasons it may take a couple of hours until your identity is also removed
            from our authentication provider. Your data will be deleted completely without any option to restore it.'
          cancelButton='Keep my account.'
          confirmButton="Delete my account and all of my data forever!"
          onCancel={this.handleDialogCancel}
          onConfirm={this.handleDialogConfirm}
        />

        <Modal
          closeIcon
          open={this.state._voucherModalOpen}
          onClose={this.closeVoucherModal}
        >
          <Modal.Header>Activate upgrades</Modal.Header>
          <Modal.Content>
            <VoucherForm
              onSubmit={this.handleVoucherSubmit}
              voucher={this.state.voucher}
            />
          </Modal.Content>
        </Modal>

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
                          <LinkToLogin
                            emailVerified={
                              (this.state.account.userInfo||{}).emailVerified
                            }
                            onSignOut={this.logout}
                          />
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
                              {/* {this.state._saveStatus === SAVED ? (
                                  <Message positive attached
                                    icon='checkmark'
                                    header='Saved!'
                                    content='Your account was successfully saved.'
                                  />
                                ) : ""
                              } */}
                              <Button.Group attached="top">
                              
                                <Button positive animated='fade'
                                    disabled={!(this.state._saveStatus === DIRTY)}
                                    onClick={this.handleSaveClick}>
                                    <Button.Content hidden>Save</Button.Content>
                                    <Button.Content visible>
                                        <Icon name={(this.state._saveStatus === SAVING) ? "hourglass" : "save"} />
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

                              <h4 class="ui dividing header">Your profile</h4>
                              
                              <div class="two fields">
                                <div class="field">
                                  <label>Avatar</label>
                                  <img class="ui avatar image" src={user.picture}></img>
                                </div>
                                <div class="field">
                                  <label>Nickname</label>
                                  <input disabled type="text" readOnly value={user.nickname}></input>
                                </div>
                              </div>
                              <div class="two fields">
                                <div class="field">
                                  <label>Email</label>
                                  <input disabled type="text" readOnly value={user.email}></input>
                                </div>
                                <div class="field">
                                  <label>Name</label>
                                  <input disabled type="text" readOnly value={user.name}></input>
                                </div>
                              </div>
                              <div class="two fields">
                                <Form.Field>
                                  <Checkbox 
                                    disabled readOnly
                                    label={
                                      (this.state.account.userInfo||{}).emailVerified
                                      ? 'Email address verified'
                                      : 'Email not verified - notifications are disabled!'
                                    }
                                    value='emailVerified'
                                    checked={(this.state.account.userInfo||{}).emailVerified}
                                    />
                                </Form.Field>
                              </div>

                              <div class="ui hidden divider"></div>
                              <h4 class="ui dividing header">Preferences</h4>
                              <div class="ui segment">
                                <Form.Field>
                                  <Checkbox 
                                    toggle 
                                    label='Email notifications for hot topics' 
                                    value='notificationsHotTopics'
                                    checked={(this.state.account.preferences||{}).notificationsHotTopics}
                                    onChange={this.togglePrefValue}
                                    />
                                </Form.Field>
                                <Form.Field>
                                  <Checkbox 
                                    toggle 
                                    label='Email notifications for inventories (master switch)' 
                                    value='notificationsInventories'
                                    checked={(this.state.account.preferences||{}).notificationsInventories}
                                    onChange={this.togglePrefValue}
                                    />
                                </Form.Field>
                              </div>

                              <div class="ui hidden divider"></div>
                              <h4 class="ui dividing header">Inventories</h4>
                              <div class="ui message">
                                <div class="header">You have saved the following inventories:</div>
                                {
                                  ((this.state.account||{}).inventories)
                                  ? <Inventories 
                                    inventories={this.state.account.inventories}
                                  />
                                  : "No inventories."
                                }
                              </div>

                              <div class="ui hidden divider"></div>
                              <h4 class="ui dividing header">Invites</h4>
                              <div class="ui message">
                                <div class="header">You have invited the following users to your organization:</div>
                                <ul class="list">
                                  <li>[No invites]</li>
                                </ul>
                              </div>

                              <div class="ui hidden divider"></div>
                              <h4 class="ui dividing header">Account Upgrades</h4>
                              <Button primary disabled={false}
                                    animated='fade'
                                    onClick={this.handleRedeemVoucherClick}>
                                    <Button.Content visible>Enter upgrade code</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='angle double up' />
                                    </Button.Content>
                              </Button>
                              <div class="ui message">
                                <div class="header">You activated the following upgrades:</div>
                                {
                                  ((this.state.account.tenant||{}).subscriptions)
                                  ? <Subscriptions 
                                    subscriptions={this.state.account.tenant.subscriptions}
                                  />
                                  : "No upgrades."
                                }
                              </div>

                              {/* {this.state._saveStatus === SAVED ? (
                                  <Message positive attached
                                    icon='checkmark'
                                    header='Saved!'
                                    content='Your account was successfully saved.'
                                  />
                                ) : ""
                              } */}
                                <Button.Group attached="top">
                                  <Button positive animated='fade'
                                      disabled={!(this.state._saveStatus === DIRTY)}
                                      onClick={this.handleSaveClick}>
                                      <Button.Content hidden>Save</Button.Content>
                                      <Button.Content visible>
                                          <Icon name={(this.state._saveStatus === SAVING) ? "hourglass" : "save"} />
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