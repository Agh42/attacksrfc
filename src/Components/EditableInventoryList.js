import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import CpeClient from '../Gateways/CpeClient';
import CPEs from '../Dto/CPEs';

//###############################################################
//### AutoSuggest functions:



function getSuggestionValue(suggestion) {
    //return suggestion.title;
    let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
    [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
        = suggestion.id.split(":");
    return vendor+":"+product+":"+version+":"+update+":"+edition;
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
                    <div className="item">
                        <div class={this.props.isActive ? "ui teal label" : "ui label"} > 
                            <i className="delete icon"
                                onClick={this.handleDeleteClick}></i>&nbsp;&nbsp;
                            <i className="tags icon"
                                onClick={this.handleEditCpeClick}></i>
                            <a className="detail"
                                onClick={this.handleCpeClick}>
                                {vendor+":"+product+":"+version+":"+update+":"+edition}
                            </a>
                        </div>
                    </div>
            )};
}


/**
 * List of all searched and saved CPEs. 
 * 
 */
export default class EditableInventoryList extends Component {
    constructor() {
        super();
        this.state = {
                searchValue: '',
                suggestions: [],
                _isLoading: false,
        }
        this.latestRequest = null;
    }
    
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
        
        // attributes for autosuggest input:
        const {searchValue, suggestions} = this.state;
        const inputProps = {
                placeholder: 'Windows 10, Redhat, Acrobat Reader...',
                value: searchValue,
                onChange: this.onChange
        };
        
        return (
                <div className="ui raised segment" 
                     style={{overflow: 'auto', "height":"30em"}}>
                    <Autosuggest 
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        onSuggestionSelected={this.onSuggestionSelected}
                        renderSuggestion={renderSuggestion}
                        focusInputOnSuggestionClick={false}
                        inputProps={inputProps} 
                    />
                {this.state._isLoading ? (<i className="sync icon" />) : ''}   
                <br/>
                <div className="field">
                     <button className="ui positive labeled icon button" 
                         data-tooltip="Save this asset list." 
                         data-position="bottom center"
                         onClick={this.props.onSaveClick} >
                         <i class="lock icon"></i>
                          Save collection
                    </button>
                     <button className="ui negative labeled icon button" 
                          data-tooltip="Get emails on new critical vulnerabilities!" 
                          data-position="bottom center"
                          onClick={this.props.onSaveClick}>
                          <i class="lock icon"></i>
                          Notifications are off
                    </button>
                </div>
              
                <div className="ui list">
                      {cpeItems}
                </div>
            </div>
        );
    }
}