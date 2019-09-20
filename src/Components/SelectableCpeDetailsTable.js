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
        isSelected: propTypes.boolean.isRequired,
        onClick: propTypes.function.isRequired,
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
        cpes: PropTypes.array.isRequired;
        onSelect: PropTypes.function.isRequired,
    };
    
    constructor() {
        super();
        this.state = {
            cpesWithCveCounts: [],
            _isLoading: false,
        }
     }
          
    render() {
        //component for cpe list:
        const selectableCpeItemList = this.props.cpes.map((cpe) => (
            <CpeSummaryItem 
                onClick={this.props.onSelect}
                cpe={cpe}
                key={cpe.id}
            />
        ));
       
        return (
           
        );
    }
}