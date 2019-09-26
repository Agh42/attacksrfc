import React, { Component } from 'react';

import moment from 'moment';
import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CveDetails from '../Components/CveDetails';
import CpeClient from '../Gateways/CpeClient';

import {Link, Redirect} from 'react-router-dom';
import { ENGINE_METHOD_NONE } from 'constants';

// cve items displayed per page:
const itemsPerPage = 20;

// trigger actions for cve loading:
// TODO move to redux store and actions
const CVE_ACTION_NONE = '_NONE';
const CVE_ACTION_RELOAD = '_RELOAD';

// which summary list to show:
const SHOW_SUMMARY_CPE = 'SHOW_SUMMARY_CPE';
const SHOW_SUMMARY_CVE = 'SHOW_SUMMARY_CVE';

// trigger cpe summary loading:
const CPE_ACTION_NONE = '_NONE';
const CPE_ACTION_RELOAD = '_RELOAD';

// page load redirects:
const REDIRECT_PRICING = '/pricing';

export default class AttackSrfcPage extends Component {


class CpeSummaryDTO {
    cpe;
    cveSummaryCount;
}

/*
 * selectedCpes:            cpe list used by cpe inventory
 * selectedCves:            cve list used by graph display
 * selectedCve:
 * selectedCvesPage:        paginated cve list used by cvelist component
 * selectedCvesTotalCount:  number of all cves for current inventory
 * stats:                   amount of cves/cpes in database and time of last update
 * numTotalPages:           total cve pages available           
 * numCurrentPage:          cve page being displayed
 * 
*/
    state = {
            selectedCpes: [],
            selectedCves: [],
            selectedCve: "",
            selectedCvesPage: [],
            selectedCvesTotalCount: 0,
            stats: [],
            numTotalPages: 1,
            numCurrentPage: 1,
            
            cpeSummaries: [],
            _summaryDisplay: SHOW_SUMMARY_CPE
            
            _redirect: "",
            _cveAction: CVE_ACTION_NONE, 
            -cpeAction: CPE_ACTION_NONE
    };

    componentDidMount() {
        this.initSelectedCpes();
        this.initStats();
    }

    componentDidUpdate() {
        switch (this.state._cveAction) {
            case CVE_ACTION_RELOAD:
                this.setState({_cveAction: CVE_ACTION_NONE});
                this.loadCvesPage();
                break;
            default:
                break;
                
        }
         switch (this.state._cpeAction) {
            case CPE_ACTION_RELOAD:
                this.setState({_cpeAction: CPE_ACTION_NONE});
                this.loadCpeSummaries();
                break;
            default:
                break;
                
        }
    }

    // FIXME cvss sort incorrect over multiple CPEs - some cvss are strings
    // FIXME add vendor and product field insert to cvesearch cronjob
    // TODO add iphone and adobe reader to example cves
    // TODO add red "Full. Text. Search." to cpe dropdown
    // TODO make word after space search windows_10 AND narrow windows results
    // FIXME page counter not reset when cpe has only 1 cve


    initSelectedCpes = () => {
        this.setState( {selectedCpes: CpeClient.getExampleCpes(),
                        _cveAction: CVE_ACTION_RELOAD,
                    });
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

    handleSaveClick = () => {
          this.setState({_redirect: REDIRECT_PRICING});
    }

    handlePaginationChange = (newPage) => {
        this.setState({numCurrentPage: newPage,
            _cveAction: CVE_ACTION_RELOAD,
        });
    }

    handleDeleteCpeClick = (cpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.filter(c => c.id !== cpeId),
            _cveAction: CVE_ACTION_RELOAD,
            _cpeAction: CPE_ACTION_RELOAD,
        });
    }

    /**
     * Check if selected CPE is already present. If not, add it and set its
     * status to active.
     */
    handleAddCpeClick = (newCpe) => {
        let cpePresent= this.state.selectedCpes.filter(c => c.id === newCpe.id);
        if ( !cpePresent.length ) {
            let activeCpe = {...newCpe, isActive: true};
            this.setState( {
                selectedCpes: [...this.state.selectedCpes, activeCpe],
                _cveAction: CVE_ACTION_RELOAD,
                _cpeAction: CPE_ACTION_RELOAD,
            });
        }
    }


    /*
     * For the query the URI format of the CPE is used (see NISTIR 7695) because this is how CVEs
     * store references to CPEs in the database. This also allows left aligned regex matching to use the database index
     * which speeds up the search significantly.
     *
     */    
    getCpesAsUriBinding = () => {
        let reCutOff = /(cpe:\/.*?)[:-]*$/; //removes all trailing ":-"
        let cpesLeftAlignedURIBinding = this.state.selectedCpes.filter(c => c.isActive)
            .map ( (newCpe) => {
            //create cpe 2.2 by replacing version number:
            let cpe22 = newCpe.id.replace(/2.[23]:/, "/");
            let match = reCutOff.exec(cpe22);
            let cutOffCpe = match ? match[1] : cpe22;
            console.log("Getting CVEs for reduced CPE: " + cutOffCpe);
            return cutOffCpe;
        });
        return cpesLeftAlignedUriBinding;
    }

    loadCvesPage = () => {
        let pageToGet = this.state.numCurrentPage;
        let cpesLeftAlignedURIBinding = getCpesAsUriBinding();
        
        if (cpesLeftAlignedURIBinding().length > 0) {
            CpeClient.getCvesForCpes(cpesLeftAlignedURIBinding, itemsPerPage, pageToGet, (newCves) => (
                this.setState({
                    selectedCvesPage: newCves.result,
                    selectedCvesTotalCount: newCves.resultCount,
                    numTotalPages : Math.ceil(newCves.resultCount / itemsPerPage),
                }))
            );
        } else {
            this.setState( {
                selectedCvesPage: [],
                selectedCvesTotalCount: 0,
                numTotalPages: 1,
                numCurrentPage: 1,
            });
        }
    }
    
    // load cve counts for selected cpes:
    loadCpeSummaries = () => {
        let cpesLeftAlignedURIBinding = getCpesAsUriBinding();
        // sync cpe to cpesummary list:
        // add missing:
        
        xxx remove deleted
         
        // load cve counts where missing:
        if (cpesLeftAlignedURIBinding().length > 0) {
            this.state.selectedCpes.filter(c => c.isActive).foreach( (cpe) => {
            
            })
                CpeClient.getCveSummaryForCpe(cpesummary.cpe.id, (summary) => {
                    cpesummary.count = count;
                    this.setState(
                    );
                });

        } else {
            this.setState( {
                cpeSummaries: [],
            });
        }
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
            _cveAction: CVE_ACTION_RELOAD,
            _cpeAction: CPE_ACTION_RELOAD,
        });
    }

    formatNumber(number) {
        return number ? number.toLocaleString() : number;
    }

    formatDateTime(isoDate) {
        let mom = moment(isoDate, moment.ISO_8601, true);
        return mom.format('YYYY-MM-DDTHH:mmZ');
    }

    handleEditCpeClick = (editCpeId) => {
        console.log("Edit " + editCpeId);
    }

    render() {
        if (this.state._redirect) {
            return {
                REDIRECT_PRICING: <Redirect push to={REDIRECT_PRICING} />,
            }[this.state._redirect];
        }
        return (
         <React.Fragment>
          <div class="ui grid">
              <div class="computer only row">
                  <div class="column">
                      <div class="ui top fixed inverted teal icon menu">
                          <a className="item"href="/homepage.html"><i className="home icon" /></a>
                           <div className="ui item"><h4 className="ui left aligned inverted header">
                               AttackSrfc - CVE Search and Vulnerability Management
                               <div className="sub header">
                               Tracking: {this.formatNumber(this.state.stats.cpeCount)} Product Versions - {this.formatNumber(this.state.stats.cveCount)} Vulnerabilities
                               - Last updated: {this.formatDateTime(this.state.stats.lastModified)}
                               </div>
                               </h4>
                           </div>
                           <div class="right menu primary">
                           <Link to="/login" class="item">
                             <i className="sign in icon" />
                             &nbsp;&nbsp;Login
                           </Link>
                           <Link to="/settings" class="item">
                             <i className="disabled cog icon" />
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
                        onDeleteClick={this.handleDeleteCpeClick}
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

            <div className='two column row'>
                <div className='six wide column'>
                {/*
                    <CveDetails
                        selectedCve={this.state.selectedCve}
                    />
                */}
                </div>
                
                <div className='ten wide column'>
                   <div className='ui raised segment'>
              
                        {this.state._summaryDisplay === SHOW_SUMMARY_CPE
                        ?   <SelectableCpeDetailsTable
                                cpesWithCveCounts={this.state.cpesWithCveCounts}
                                onSelect={this.handleCpeSummarySelected}
                            />
                        :
                            <CveList
                                selectedCvesPage={this.state.selectedCvesPage}
                                numTotalPages={this.state.numTotalPages}
                                numCurrentPage={this.state.numCurrentPage}
                                onPaginationChange={this.handlePaginationChange}
                                numTotalCves={this.state.selectedCvesTotalCount}
                            />   
                        }
                    </div>
                </div>
            </div>
        </div>
                    <div class="ui  vertical footer segment">
                    <div class="ui center aligned container">


                      <div class="ui  section divider"></div>
                      <a className="item" href="/homepage.html">
                      <img class="ui centered image" src="images/logos/cstoolio_60.png" />
                      </a>
                      <div class="ui horizontal  small divided link list">
                        <a class="item" href="welcome.html#">Home</a>
                        <a class="item" href="contact.html#">Support and Contact</a>
                        <a class="item" href="legal.html#">Legal Notice and License</a>             
                      </div>
                    </div>
                  </div>
        </React.Fragment>
        );
        }
  }

