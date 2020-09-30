import React, { Component } from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react'
import Autosuggest from 'react-autosuggest';
import CpeClient from '../Gateways/CpeClient';
import CPEs from '../Dto/CPEs';
import {Link, Redirect} from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';

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
        _isLoading: false,
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

    handleSaveInventoryClick = () => {
        this.props.onSaveInventoryClick();
    }

    handleAddInventoryClick = () => {
        if (this.props.inventories.length >= this.props.maxInventories) {
            return;
        }
        this.props.onAddInventoryClick("New inventory");
    }

    handleDeleteInventoryClick = () => {
        this.props.onDeleteInventoryClick();
    }

    handleNotificationClick = () => {
        this.props.onToggleNotificationClick();
    }

    handleDropdownChange = (e, {value}) => {
        if (value === this.props.selectedInventoryName)
            return;
        this.props.onSelectInventoryClick(value);
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
                        {isAuthenticated
                        ? <span>
                                <Link to="/login" class="item">Sign in/sign up</Link> for free to 
                                increase your inventory size and save multiple inventories.
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
                                <Button positive animated='fade'
                                    onClick={this.handleSaveInventoryClick}>
                                    <Button.Content hidden>Save</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='save' />
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
                                <Button disabled={!isAuthenticated} animated='fade'
                                    onClick={this.handleDeleteInventoryClick}>
                                    <Button.Content hidden>Del</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='trash' />
                                    </Button.Content>
                                </Button>
                                <Button negative animated='fade'
                                    onClick={this.handleNotificationClick}>
                                    <Button.Content hidden>Alerts</Button.Content>
                                    <Button.Content visible>
                                        <Icon name={this.props.inventories.find(i => i.name === this.props.selectedInventoryName).notify 
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