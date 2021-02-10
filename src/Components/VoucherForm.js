import React, { Component } from "react";
import { Form, Message } from 'semantic-ui-react';
import { AccountClient } from '../Gateways/AccountClient';
import { withAuth0 } from '@auth0/auth0-react';

class VoucherForm extends Component {
  state = {
      voucher: "",
      error: false,
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {getAccessTokenSilently} = this.props.auth0;
    getAccessTokenSilently().then(
      this.redeemWithToken
    );
  }

  redeemWithToken = (token) => {
    AccountClient.redeemVoucher(
      this.state.voucher, 
      token, 
      (success) => {this.props.onSubmit(this.state.voucher)}, 
      (failure) => {this.setState({error: true})}
    );
  }

  render() {
    const { voucher, error } = this.state;

    return (
        <Form onSubmit={this.handleSubmit} error={error}>
             <Message>
              <Message.Content>
                <Message.Header>Enter your upgrade code</Message.Header>
                You can get upgrade codes by signing up for a PRO account at <a 
                href="https://patreon.com/cstool_io" target="_blank" rel="noopener noreferrer">
                Patreon</a>. You may also follow CSTOOL.io on <a
                   href="https://www.reddit.com/r/CSTOOL_io" target="_blank" rel="noopener noreferrer">Reddit</a>, 
                <a href="https://twitter.com/cstool_io" target="_blank" rel="noopener noreferrer">Twitter</a>, 
                <a href="https://www.linkedin.com/company/cstool-io" target="_blank" rel="noopener noreferrer">LinkedIn</a> or 
                <a href="https://www.youtube.com/channel/UC5qYdSA3uSfqzdJcssdjWrQ" target="_blank" rel="noopener noreferrer">YouTube</a> for special promotions and trials.
              </Message.Content>
            </Message>
            <Message
              error
              header='Invalid code'
              content='This code is not valid or no longer usable.'
            />
            <Form.Group>
                <Form.Input 
                    name='voucher'
                    value={voucher}
                    onChange={this.handleChange}
                    autoFocus
                />
                <Form.Button content='Submit'/>
            </Form.Group>
        </Form>
    );
  }
}

export default withAuth0(VoucherForm);