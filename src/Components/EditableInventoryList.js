import React, { Component } from 'react';
import { Button, Icon, Dropdown, Modal, Header } from 'semantic-ui-react'
import Autosuggest from 'react-autosuggest';
import CpeClient from '../Gateways/CpeClient';
import CPEs from '../Dto/CPEs';
import {Link, Redirect} from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';
import Message, { MESSAGE_INVENTORY_LIMIT } from './Message.js';
import {
ACCOUNT_NONE,
ACCOUNT_SAVE_DIRTY,
ACCOUNT_SAVE_CLEAN,
ACCOUNT_SAVE_SAVING,
ACCOUNT_LOADING} from '../Pages/AttackSrfcPage';
import RenameForm from './RenameForm';

//###############################################################
//### AutoSuggest functions:


const renderAutoSuggestInputComponent = inputProps => (
    <div className="inputContainer">
        <div class="ui fluid left icon input">
            <input {...inputProps} />
            <i class="search icon"></i>
        </div>
    </div>
)

function getSuggestionValue(suggestion) {
    //return suggestion.title;
    let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
    [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
        = suggestion.id.split(":");
    return type+":"+vendor+":"+product+":"+version+":"+update+":"+edition;
}

function renderSuggestion(suggestion) {
    const suggestionLabel = getSuggestionValue(suggestion);
    return ( 
        <div className="item">
            <div class="ui teal label">
                    {suggestionLabel}
            </div>
        </div>
    );
}
//###############################################################


/**
 * Single editable CPE entry in the list.
 * CPE format is: cpe:cpeversion:type:vendor:product:version:update:edition
 *                :lang:sw_edition:target_sw:target_hw:other
 * 
 */
class CpeItem extends React.Component {
    
    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.cpe.id);
    }
    
    handleEditCpeClick = () => {
        this.props.onEditCpeClick(this.props.cpe.id);
    }
    
    handleCpeClick = () => {
        this.props.onCpeClick(this.props.cpe.id);
    }

    
    
    render() {
        let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
            = this.props.cpe.id.split(":");

        return (
            <div class="item">
                <div class="right floated content">
                    <i className="delete link icon"
                            onClick={this.handleDeleteClick}></i>&nbsp;
                    <i className="tags link icon"
                            onClick={this.handleEditCpeClick}></i>
                </div>
                
                <div class="content">
                    <div class={this.props.isActive ? "ui teal label" : "ui label"} > 
                        <i className={ {
                                    'o': "terminal icon",
                                    'a': "desktop icon",
                                    'h': "microchip icon",
                                }[type]
                            }
                            ></i>
                        <a className="detail"
                            onClick={this.handleCpeClick}>
                            {type+":"+vendor+":"+product+":"+version+":"+update+":"+edition}
                        </a>
                    </div>
                </div>
            </div>
        )};
}


/**
 * List of all searched and saved CPEs. 
 * 
 */
class EditableInventoryList extends Component {
    state = {
        searchValue: '',
        suggestions: [],
        message: '',
        _isLoading: false,
        _modalOpen: false,
    }
    latestRequest = null;
    
    onChange = (event, { newValue, method }) => {
        this.setState({
          searchValue: newValue
        });
        if (method === "click") {
            this.setState({
              searchValue: this.state.searchValue
            });
        }
      };
      
      onSuggestionsFetchRequested = ({ value }) => {
        if (value.length<3) {
            this.setState({
              suggestions: []
            });
        } else {
            this.loadSuggestions(value)
        }
      };

      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };
      
      onSuggestionSelected = (event, selection) => {
          console.log("selected: " + selection.suggestion.id);
          this.props.onSelectCpeClick(selection.suggestion);
      }
      
      loadSuggestions = (value) => {
              this.setState({
                  _isLoading: true
              });
              const escapedValue = CPEs.escapeRegexCharacters(value.trim());
              if (escapedValue === '') {
                  return [];
              }

              // Make request (async)
              const thisRequest = this.latestRequest =
                  CpeClient.getAutoCompleteItems(escapedValue, (suggestions) => {

                      // If this is true there's a newer request happening, just return
                      if (thisRequest !== this.latestRequest) {
                          return;
                      }

                      // else set state:
                      this.setState({
                          suggestions: suggestions,
                          _isLoading: false
                      });
                  })
      }

    handleSaveInventoryClick = (e, data) => {
        e.preventDefault();
        
        this.props.onSaveInventoryClick();
    }

    handleAddInventoryClick = (e, data) => {
        e.preventDefault();
        if (this.props.inventories.length >= this.props.maxInventories) {
            this.setState({
                message: MESSAGE_INVENTORY_LIMIT,
            });
            return;
        }
        this.props.onAddInventoryClick("New inventory");
    }

    handleRenameInventoryClick = (e, data) => {
        e.preventDefault();
        this.setState({_modalOpen: true});
    }

    handleDeleteInventoryClick = (e, data) => {
        e.preventDefault();
        this.setState({_deleteModalOpen: true});
    }

    handleNotificationClick = (e, data) => {
        e.preventDefault();
        this.props.onToggleNotificationClick();
    }

    handleDropdownChange = (e, {value}) => {
        e.preventDefault();
        if (value === this.props.selectedInventoryName)
            return;
        this.props.onSelectInventoryClick(value);
    }

    handleRenameSubmit = (newName) => {
        this.setState({_modalOpen: false});
        this.props.onRenameInventoryClick(newName);
    }
    
    closeModal = () => {
        this.setState({_modalOpen: false});
    }

    closeDeleteModal = () => {
        this.setState({_deleteModalOpen: false});
    }

    confirmDeleteModal = () => {
        this.closeDeleteModal();
        this.props.onDeleteInventoryClick();
    }
    
    render() {
        // stateless component for cpe list:
        const cpeItems = this.props.selectedCpes.map((cpe) => (
            <CpeItem 
                onDeleteClick={this.props.onDeleteClick}
                onEditCpeClick={this.props.onEditCpeClick}
                onCpeClick={this.props.onCpeToggleClick}
                cpe={cpe}
                id={cpe.id}
                key={cpe.id}
                isActive={cpe.isActive}
            />
        ));

        const {
            isLoading,
            isAuthenticated,
            error,
            user,
        } = this.props.auth0;
        
        // attributes for autosuggest input:
        const {searchValue, suggestions} = this.state;
        const inputProps = {
                placeholder: 'Windows 10, Redhat, Acrobat Reader...',
                value: searchValue,
                onChange: this.onChange
        };

        const inventoryOptions = this.props.inventories.map( (i) => {
            return {key: i.name, value: i.name, text: i.name};
        });

        // const inventories = [
        //     { key: 'i1', value: 'i1', text: '<Unsaved inventory>' },
        //     { key: 'inew', value: 'inew', text: '<Add new...>' },
        // ]

       
        
        return (
                <div className="ui raised segment" 
                     style={{overflow: 'auto', "height":"52em"}}>

                    <Modal
                        closeIcon
                        open={this.state._modalOpen}
                        onClose={this.closeModal}
                    >
                        <Modal.Header>Rename</Modal.Header>
                        <Modal.Content>
                            <RenameForm 
                                onSubmit={this.handleRenameSubmit} 
                                inventoryName={this.props.selectedInventoryName}
                            />
                        </Modal.Content>
                    </Modal>

                    <Modal
                        closeIcon
                        open={this.state._deleteModalOpen}
                        onClose={this.closeDeleteModal}
                    >
                        <Modal.Header>Delete</Modal.Header>
                        <Modal.Content>
                        <Modal.Description>
                            <Header>Delete inventory: "{this.props.selectedInventoryName}" ?</Header>
                            <p>
                                Do you really want to remove the selected inventory? This action is final
                                and cannot be undone. You will loose all selected products for this inventory.
                            </p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.closeDeleteModal}>
                            Cancel
                            </Button>
                            <Button negative
                                content="Delete inventory"
                                labelPosition='right'
                                icon='checkmark'
                                onClick={this.confirmDeleteModal}
                                positive
                            />
                        </Modal.Actions>
                    </Modal>

                    {
                        (this.state.message)
                        ? <Message message={this.state.message}   />
                        : ""
                    }

                    {(this.props.selectedCpes.length > this.props.maxCpes )
                    || (this.props.inventories.length > this.props.maxInventories)
                    ? <div className="ui negative icon message">
                        <i className="warning circle icon"></i>
                        <div class="content">
                        {this.props.selectedCpes.length > this.props.maxCpes
                            ? 'This inventory is full. '
                            : ''} 
                        {this.props.inventories.length > this.props.maxInventories
                            ? 'You cannot create another inventory. '
                            : ''} 
                        {!isAuthenticated
                        ? <span>
                                <Link to="/register" class="item">Sign in/sign up</Link> to 
                                increase your inventory size and save multiple inventories. It's free!
                          </span>
                        : <span>
                                <Link to="/register" class="item">Upgrade your account</Link> to 
                                increase your inventory size and save multiple inventories.
                          </span>
                        }
                        </div>
                      </div>
                    : <span>
                        <h3 class="ui header">
                            <i class="archive icon"></i>
                            <div class="content">
                                Inventory
                                <div class="ui teal sub header">{this.props.selectedInventoryName}</div>
                            </div>
                        </h3>
                        <form class="ui form">
                            <div class="field">
                                <Dropdown
                                    placeholder='<Unsaved inventory...>'
                                    onChange={this.handleDropdownChange}
                                    fluid
                                    search
                                    selection
                                    options={inventoryOptions}
                                />
                            </div>
                         
                            <Button.Group attached="top">
                                <Button 
                                    animated='fade'
                                    disabled={this.props.accountStatus !== ACCOUNT_SAVE_DIRTY}
                                    onClick={this.handleSaveInventoryClick}>
                                    <Button.Content hidden>
                                    {
                                        {
                                            [ACCOUNT_SAVE_DIRTY]: ( "Save" ),
                                            [ACCOUNT_LOADING]: ("Loading"),
                                            [ACCOUNT_NONE]: ("Save"),
                                            [ACCOUNT_SAVE_CLEAN]: ("Saved"),
                                            [ACCOUNT_SAVE_SAVING]: ("Saving")
                                        }[this.props.accountStatus]
                                    }
                                    </Button.Content>
                                    <Button.Content visible>
                                    {
                                        {
                                            [ACCOUNT_SAVE_DIRTY]: (
                                                <Icon name='save' />
                                            ),
                                            [ACCOUNT_LOADING]: (
                                                <Icon name='hourglass outline' />
                                            ),
                                            [ACCOUNT_NONE]: (
                                                <Icon name='save' />
                                            ),
                                            [ACCOUNT_SAVE_CLEAN]: (
                                                <Icon name='save outline' />
                                            ),
                                            [ACCOUNT_SAVE_SAVING]: (
                                                <Icon name='hourglass outline' />
                                            )
                                        }[this.props.accountStatus]
                                    }
                                    </Button.Content>
                                </Button>
                                <Button disabled={!isAuthenticated}
                                    animated='fade'
                                    onClick={this.handleRenameInventoryClick}>
                                    <Button.Content hidden>Rename</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='edit outline' />
                                    </Button.Content>
                                </Button>
                                <Button disabled={!isAuthenticated}
                                    animated='fade'
                                    onClick={this.handleAddInventoryClick}>
                                    <Button.Content hidden>Add</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='plus' />
                                    </Button.Content>
                                </Button>
                                <Button disabled={!isAuthenticated || this.props.inventories.length <2} animated='fade'
                                    onClick={this.handleDeleteInventoryClick}>
                                    <Button.Content hidden>Del</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='trash' />
                                    </Button.Content>
                                </Button>
                                <Button 
                                    positive={(this.props.inventories.find(i => i.name === this.props.selectedInventoryName)||{}).notify} 
                                    negative={!(this.props.inventories.find(i => i.name === this.props.selectedInventoryName)||{}).notify} 
                                    animated='fade'
                                    onClick={this.handleNotificationClick}>
                                    <Button.Content hidden>Alerts</Button.Content>
                                    <Button.Content visible>
                                        <Icon name={(this.props.inventories.find(i => i.name === this.props.selectedInventoryName)||{}).notify 
                                            ? 'bell' 
                                            : 'bell slash'} />
                                    </Button.Content>
                                </Button>
                            </Button.Group>
                        </form>
                      
                        
                        <h4 class="ui horizontal divider header">
                            Product selection
                        </h4>
                        <Autosuggest 
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            onSuggestionSelected={this.onSuggestionSelected}
                            renderSuggestion={renderSuggestion}
                            focusInputOnSuggestionClick={false}
                            inputProps={inputProps} 
                            renderInputComponent={renderAutoSuggestInputComponent}
                        />
                    </span>
                    }
                {this.state._isLoading 
                ? <Icon loading name='spinner' />
                : ''
                }   
                <br/>
                <div className="ui celled list">
                      {cpeItems}
                </div>
            </div>
        );
    }
}
export default withAuth0(EditableInventoryList);