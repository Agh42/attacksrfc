import React, { Component } from 'react';
import './App.css';

import CveGraph from './Components/CveGraph';
import EditableInventoryList from './Components/EditableInventoryList';
import CveList from './Components/CveList';
import CpeClient from './Scripts/CpeClient';

import PricingPage from './Pages/PricingPage';

export default class App extends Component {
    
    state = {
            selectedCpes: [],
            selectedCves: [],
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
    
    constructor(props) {
        super(props);
        this.registerRef= React.createRef();
    }
    
    handleSaveClick = () => {
          window.scrollTo(0, this.registerRef);
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
    return (
          <React.Fragment>
          <div class="ui grid">
              <div class="computer only row">
                  <div class="column">
                      <div class="ui top fixed inverted teal icon menu">
                          <a className="item"href="/homepage.html"><i className="home icon" /></a>
                           <div className="ui item"><div className="ui inverted header">
                               Attack Surface - Vulnerability Management Now.
                           </div></div>
                           <div class="right menu primary">
                           <a class="item">
                             <i className="sign in icon" />
                             &nbsp;&nbsp;Login
                           </a>
                           <a class="item">
                             <i className="cog icon" />
                           </a>
                           <a class="ui dropdown item">
                             <i className="user circle icon" />
                             <i class="angle down icon"></i>
                             <div class="inverted menu">
                               <div class="item">
                                 <i class="building icon"></i>
                                 Account Settings
                               </div>
                               <div class="item">
                                 <i class="building icon"></i>
                                 Security
                               </div>
                             </div>
                           </a>
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
            
            <div className='one column row'>
                <div className='sixteen wide column'>
                <div ref={this.registerRef} ></div>
                    <PricingPage 
                    />
                </div>
            </div> 
            
        </div> 
                    <div class="ui  vertical footer segment">
                    <div class="ui center aligned container">
                      <div class="ui stackable  divided grid">
                        <div class="three wide column">
                          <h4 class="ui  header">
                            Group 1
                          </h4>
                          <div class="ui  link list">
                            <a class="item" href="fixed.html#">Link One</a><a class="item" href="fixed.html#">Link Two</a><a class="item" href="fixed.html#">Link Three</a><a class="item" href="fixed.html#">Link Four</a>
                          </div>
                        </div>
                        <div class="three wide column">
                          <h4 class="ui  header">
                            Group 2
                          </h4>
                          <div class="ui  link list">
                            <a class="item" href="fixed.html#">Link One</a><a class="item" href="fixed.html#">Link Two</a><a class="item" href="fixed.html#">Link Three</a><a class="item" href="fixed.html#">Link Four</a>
                          </div>
                        </div>
                        <div class="three wide column">
                          <h4 class="ui  header">
                            Group 3
                          </h4>
                          <div class="ui  link list">
                            <a class="item" href="fixed.html#">Link One</a><a class="item" href="fixed.html#">Link Two</a><a class="item" href="fixed.html#">Link Three</a><a class="item" href="fixed.html#">Link Four</a>
                          </div>
                        </div>
                        <div class="seven wide column">
                          <h4 class="ui  header">
                            Footer Header
                          </h4>
                          <p>
                            Extra space for a call to action inside the footer that could help re-engage users.
                          </p>
                        </div>
                      </div>
                      <div class="ui  section divider"></div>
                      <img class="ui centered image" src="images/logos/cstoolio_60.png" />
                      <div class="ui horizontal  small divided link list">
                        <a class="item" href="fixed.html#">Site Map</a><a class="item" href="fixed.html#">Contact Us</a><a class="item" href="fixed.html#">Terms and Conditions</a><a class="item" href="fixed.html#">Privacy Policy</a>
                      </div>
                    </div>
                  </div>
        </React.Fragment>
    );
  }
}
