import React, { Component } from 'react';

import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CpeClient from '../Gateways/CpeClient';

import {Link, Redirect} from 'react-router-dom';

const itemsPerPage = 20;


export default class AttackSrfcPage extends Component {
    

    state = {
            selectedCpes: [],
            selectedCves: [],
            selectedCvesPage: [],
            stats: [],
            numTotalPages: 1,
            numCurrentPage: 1,
            _redirect: "",
    };
    
    componentDidMount() {
        this.initSelectedCpes();
        this.initSelectedCves();
        this.initStats();
    }
    
    initSelectedCpes = () => {
        this.setState({selectedCpes: CpeClient.getExampleCpes()});
    }

    initStats = () => {
        this.setState({stats: {
            cpeCount: "<no data>",
            cveCount: "<no data>",
            lastModified: "1977-10-20",
        }});
        CpeClient.getStats( (dbStats) => {
            this.setState({stats: dbStats});
        });
    }
    
    initSelectedCves = () => {
        this.setState({
            selectedCves: CpeClient.getExampleCves(),
            selectedCvesPage: CpeClient.getExampleCves().slice(0,20),
        });
    }
    
    handleSaveClick = () => {
          this.setState({_redirect: "PRICING"});
    }

    handlePaginationChange = (newPage) => {
        this.setState({numCurrentPage: newPage,});
        
    }
    
    handleDeleteClick = (cpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.filter(c => c.id !== cpeId),
        });
        this.loadCvesPage();
    }
    
    /**
     * Check if selected CPE is already present. If not, add it and set its 
     * status to active.
     */
    handleAddCpeClick = (newCpe) => {
        let cpePresent= this.state.selectedCpes.filter(c => c.id === newCpe.id);
        if ( !cpePresent.length ) {
            let activeCpe = {...newCpe, isActive: true};
            this.setState({
                selectedCpes: [...this.state.selectedCpes, activeCpe]
            });
            this.loadCvesPage();
        }
    }
    
    /*
     * For the query the URI format of the CPE is used (see NISTIR 7695) because this is how CVEs 
     * store references to CPEs in the database. This also allows left aligned regex matching to use the database index
     * which speeds up the search significantly.
     * 
     */ 
    loadCvesPage = () => {
        let reCutOff = /(cpe:\/.*?):-/;
        let pageToGet = this.state.numCurrentPage;
        let cpeLeftAlignedURIBinding = this.state.selectedCpes.map ( (newCpe) => {
            //get cpe2_2, if not there try to create it ourselves by replacing version number:
            let cpe22 = newCpe.cpe_2_2 ? newCpe.cpe_2_2 : newCpe.id.replace(/2.3/, "/");  
            let match = reCutOff.exec(cpe22);
            let cutOffCpe = match ? match[1] : cpe22;
            console.log("Getting CVEs for reduced CPE: " + cutOffCpe);
            return cutOffCpe;
        });
        CpeClient.getCvesForCpes(cpeLeftAlignedURIBinding, itemsPerPage, pageToGet, (newCves) => (
            this.setState({ 
                selectedCvesPage: newCves, 
            }))
        );
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

    formatNumber(number) {
        return number ? number.toLocaleString() : number;
    }

    formatDate(date) {
        return date ? new Date(date).toLocaleString() : date;
    }
    
    handleEditCpeClick = (editCpeId) => {
        console.log("Edit " + editCpeId);
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
                           <div className="ui item"><h4 className="ui inverted header">
                               AttackSrfc Vulnerability Management 
                               - Tracking: {this.formatNumber(this.state.stats.cpeCount)} Product Versions - {this.formatNumber(this.state.stats.cveCount)} Vulnerabilities 
                               - Last updated: {this.formatDate(this.state.stats.lastModified)} 
                               </h4>
                           </div>
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
          &nbsp;
          &nbsp;
        <div className='ui stackable padded grid'>
            <div className='two column row'>
                <div className='five wide column'>
                
                    <EditableInventoryList
                        selectedCpes={this.state.selectedCpes}
                        onSelectCpeClick={this.handleAddCpeClick}
                        onSaveClick={this.handleSaveClick}
                        onDeleteClick={this.handleDeleteClick}
                        onCpeToggleClick={this.handleCpeToggleClick}
                        onEditCpeClick={this.handleEditCpeClick}
                    />
                </div>
                <div className='eleven wide column'>
                    <CveGraph 
                        selectedCves={this.state.selectedCves}
                        activeCpes={this.state.selectedCpes}
                    />
                </div>
            </div>
            
            <div className='one column row'>
                <div className='sixteen wide column'>
                    <CveList 
                        selectedCvesPage={this.state.selectedCvesPage}
                        numTotalPages={this.state.numTotalPages}
                        numCurrentPage={this.state.numCurrentPage}
                        onPaginationChange={this.handlePaginationChange}
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
  
  