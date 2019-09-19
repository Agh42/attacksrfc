import React, { Component } from 'react';
import PropTypes from 'prop-types';


/**
 * Single selectable CPE entry row.
 
 * CPE format is: cpe:cpeversion:type:vendor:product:version:update:edition
 *                :lang:sw_edition:target_sw:target_hw:other
 * 
 */
class CpeSummaryItem extends React.Component {

    static propTypes = {
        key: propTypes.string.isRequired,
        cpe: propTypes.object.isRequired,
        onCpeClick: propTypes.function.isRequired,
    };
        
    handleCpeClick = () => {
        this.props.onCpeClick(this.props.cpe.id);
    }
    
    render() {
        let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
            = this.props.cpe.id.split(":");
        
            return (
             <tr>
                <td class="single line">
                    
                </td>
                <td class="single line">
                </td>
                 <td class="single line">
                </td>
                 <td class="single line">
                </td>
                 <td class="single line">
                </td>
                 <td class="single line">
                </td>
                 
              </tr>
            )};
}


/**
 * List of all searched and saved CPEs. 
 * 
 */
export default class SelectableCpeDetailsTable extends Component {

static propTypes = {
        cpes PropTypes.array.isRequired;
    };
    
    constructor() {
        super();
        this.state = {
            cpesWithCveCounts: [],
            _isLoading: false,
        }
     }
      
      loadCpesWithCveCounts = (value) => {
              this.setState({
                  _isLoading: true
              });
              const escapedValue = escapeRegexCharacters(value.trim());
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
                placeholder: 'Windows, Redhat, Acrobat Reader...',
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
                     <button className="positive ui button" 
                         data-tooltip="Remember this asset list." 
                         onClick={this.props.onSaveClick} >
                          Save collection... 
                    </button>
                     <button className="ui negative toggle button" 
                          data-tooltip="Get emails on new critical vulnerabilities!" 
                          onClick={this.props.onSaveClick}>
                          Notifcations are off
                    </button>
                </div>
              
                <div className="ui list">
                      {cpeItems}
                </div>
            </div>
        );
    }
}