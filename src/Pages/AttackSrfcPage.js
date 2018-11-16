import React, { Component } from 'react';

import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CpeClient from '../Scripts/CpeClient';

import {Link, Redirect} from 'react-router-dom';

export default class AttackSrfcPage extends Component {
    
    state = {
            selectedCpes: [],
            selectedCves: [],
            _redirect: "",
    };
    
    componentDidMount() {
        this.initSelectedCpes();
        this.loadSelectedCves();
    }
    
    loadSelectedCves = () => {
        this.setState({selectedCves: CpeClient.getSelectedCves()});
    }
    
    initSelectedCpes = () => {
        this.setState({selectedCpes: CpeClient.getExampleCpes()});
    }
    
    loadSelectedCpes = () => {
        let cpes = CpeClient.getSelectedCpes();
        this.setState({ selectedCpes: cpes });
    }
    
    handleSaveClick = () => {
          this.setState({_redirect: "PRICING"});
    }
    
    handleDeleteClick = (cpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.filter(c => c.id !== cpeId),
        });
    }
    
    handleAddCpeClick = (newCpe) => {
        if (!this.state.selectedCpes.includes(newCpe)) {
            this.setState({
                selectedCpes: [...this.state.selectedCpes, newCpe]
            });
        }
    }
    
    handleCpeToggleClick = (toggleCpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.map((cpe) => {
               if (cpe.id === toggleCpeId) {
                   return Object.assign({}, cpe, {
                       isActive: !cpe.isActive,
                   });
               } else {
                   return cpe;
               }
            }),
        });
    }
    
    render() {
        if (this.state._redirect) {
            return {
                PRICING: <Redirect push to="/pricing" />, 
            }[this.state._redirect];
        }
        return (
         <React.Fragment>
          <div class="ui grid">
              <div class="computer only row">
                  <div class="column">
                      <div class="ui top fixed inverted teal icon menu">
                          <a className="item"href="/homepage.html"><i className="home icon" /></a>
                           <div className="ui item"><div className="ui inverted header">
                               AttackSrfc Vulnerability Management -  196.224 Vulnerabilities - 100.261 Products
                           </div></div>
                           <div class="right menu primary">
                           <Link to="/login" class="item">
                             <i className="sign in icon" />
                             &nbsp;&nbsp;Login
                           </Link>
                           <Link to="/settings" class="item">
                             <i className="cog icon" />
                           </Link>
                           <Link to="/toolbox" class="item">
                             <i className="th icon" />
                             <i class="angle down icon"></i>
                           </Link>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
          
        <div className='ui stackable padded grid'>
            <div className='two column row'>
                <div className='five wide column'>
                
                    <EditableInventoryList
                        selectedCpes={this.state.selectedCpes}
                        onSelectCpeClick={this.handleAddCpeClick}
                        onSaveClick={this.handleSaveClick}
                        onDeleteClick={this.handleDeleteClick}
                        onCpeToggleClick={this.handleCpeToggleClick}
                    />
                </div>
                <div className='eleven wide column'>
                    <CveGraph 
                        selectedCves={this.state.selectedCves}
                    />
                </div>
            </div>
            
            <div className='one column row'>
                <div className='sixteen wide column'>
                    <CveList 
                        selectedCves={this.state.selectedCves}
                    />
                </div>
            </div> 
        </div> 
                    <div class="ui  vertical footer segment">
                    <div class="ui center aligned container">
                    
                     
                      <div class="ui  section divider"></div>
                      <a className="item"href="/homepage.html">
                      <img class="ui centered image" src="images/logos/cstoolio_60.png" />
                      </a>
                      <div class="ui horizontal  small divided link list">
                        <a class="item" href="fixed.html#">Site Map</a>
                        <a class="item" href="fixed.html#">Contact Us</a>
                        <a class="item" href="fixed.html#">Terms and Conditions</a>
                        <a class="item" href="fixed.html#">Privacy Policy</a>
                      </div>
                    </div>
                  </div>
        </React.Fragment>
        );
        }
  }
  
  