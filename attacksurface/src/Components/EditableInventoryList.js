import React, { Component } from 'react';

// cpe format is: cpe:cpeversion:type:vendor:product:version:update:edition:lang:sw_edition:target_sw:target_hw:other
class CpeItem extends React.Component {
    
    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.cpe.id);
    }
    
    render() {
        let  c,cpeversion,type, vendor, product, version, rest;
        [c,cpeversion,type, vendor, product, version, ...rest] = this.props.cpe.id.split(":");
            return (
    <div className="item">
        <div class="ui image teal label">
                {vendor+":"+product+":"+version}
            <i className="delete icon"
                onClick={this.handleDeleteClick} 
            />
        </div>
    </div>
    )};
}

// List of all selected CPEs. Items can be removed by 
// button on each item.
export default class EditableInventoryList extends Component {
    render() {
        const cpeItems = this.props.selectedCpes.map((cpe) => (
            <CpeItem 
                onDeleteClick={this.props.onDeleteClick}
                cpe={cpe}
                id={cpe.id}
                key={cpe.id}
            />
        ));
        
        return (
                <div className="ui raised segment" style={{overflow: 'auto', "height":"30em"}}>
                <div id="searchInput" className="ui search">
                    <div className="ui fluid icon input ">
                        <input className="prompt" type="text" 
                            placeholder="Enter vendor or software..."/>
                        <i className="search icon"></i>
                    </div>
                    <div className="results"></div>
                </div>
                
                <br/>
              
                    
                <div className="field">
                     <button className="positive ui button" 
                         data-tooltip="Remember this asset list." 
                         onClick={this.props.onSaveClick} >
                          Save collection... 
                    </button>
                     <button className="ui negative toggle button" data-tooltip="Get emails on new critical vulnerabilities!" >
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