import React, { Component } from "react";
import { Form } from 'semantic-ui-react';

class RenameForm extends Component {
  state = {
      inventoryName: this.props.inventoryName,
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.props.onSubmit(this.state.inventoryName);
  }

  render() {
    const { inventoryName } = this.state;

    return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Group>
                <Form.Input 
                    name='inventoryName'
                    value={inventoryName}
                    onChange={this.handleChange}
                    autoFocus
                />
                <Form.Button content='Submit'/>
            </Form.Group>
        </Form>
    );
  }
}

export default RenameForm;