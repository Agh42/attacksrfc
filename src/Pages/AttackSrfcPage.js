import React, { Component } from 'react';

import moment from 'moment';
import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CveDetails from '../Components/CveDetails';
import SelectableCpeDetailsTable from '../Components/SelectableCpeDetailsTable';
import CpeClient from '../Gateways/CpeClient';
import DowntimeTimer from '../Components/DowntimeTimer';
import TimerangeSelector from '../Components/TimerangeSelector';
import CVEs from '../Dto/CVEs.js';

import {Link, Redirect} from 'react-router-dom';
import { ENGINE_METHOD_NONE } from 'constants';

// cve items displayed per page:
const itemsPerPage = 20;

// date constants
const FIRST_CPE_DATE= moment("2002-01-01T00:00:00Z");

// trigger actions for cve loading:
// TODO move to redux store and actions
const CVE_ACTION_NONE = '_NONE';
const CVE_ACTION_RELOAD = '_RELOAD';
const CVE_ACTION_LOAD_DETAILS = '_LOAD_DETAILS';

// which summary list to show:
const SHOW_SUMMARY_CPE = 'SHOW_SUMMARY_CPE';
const SHOW_SUMMARY_CVE = 'SHOW_SUMMARY_CVE';

// trigger cpe summary loading:
const CPE_ACTION_NONE = '_NONE';
const CPE_ACTION_RELOAD = '_RELOAD';

// trigger graph reload
const GRAPH_ACTION_NONE = '_NONE';
const GRAPH_ACTION_INIT = '_INIT';
const GRAPH_ACTION_RELOAD = '_RELOAD';
const GRAPH_ACTION_SUMMARIES_LOADED = '_SUMMARIES_LOADED';

// page load redirects:
const REDIRECT_REGISTER = 'REDIRECT_REGISTER';

export default class AttackSrfcPage extends Component {

    // used to explicitely disable default actions where needed:
    noop = () => {
        undefined;
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
            selectedCve: {},
            selectedCvesPage: [],
            selectedCvesTotalCount: 0,
            stats: [],
            numTotalPages: 1,
            numCurrentPage: 1,
            cveStartDate: moment().subtract(182, "days"),
            cveEndDate: moment(),
            
            graphCves: [],
            selectedCpeSummaryForGraph: {},

            cpeSummaries: [],
            selectedCpeSummary: {},
            _summaryDisplay: SHOW_SUMMARY_CPE,

            _redirect: "",
            _cveAction: CVE_ACTION_NONE,
            _graphAction: GRAPH_ACTION_NONE,
            _cpeAction: CPE_ACTION_NONE
    };

    componentDidMount() {
        this.initHealthCheck();
        this.initSelectedCpes();
        this.initStats();
    }
    
    
    componentDidUpdate() {
        switch (this.state._cveAction) {
            case CVE_ACTION_RELOAD:
                this.setState({_cveAction: CVE_ACTION_NONE});
                this.loadCvesPage();
                break;
            case CVE_ACTION_LOAD_DETAILS:
                this.setState({_cveAction: CVE_ACTION_NONE});
                this.loadCveDetails();
                break;
            default:
                break;
                }
                
        switch (this.state._graphAction) {
            case GRAPH_ACTION_RELOAD:
                this.setState({_graphAction: GRAPH_ACTION_NONE});
                this.loadGraphData();
                break;
            case GRAPH_ACTION_SUMMARIES_LOADED:
                if (! ('cpe' in this.state.selectedCpeSummaryForGraph)) {
                    // inital graph data: 
                    // after summaries are loaded, set a cpe and trigger initial cve loading:
                    this.setState({
                        _graphAction: GRAPH_ACTION_RELOAD,
                        selectedCpeSummaryForGraph: this.state.cpeSummaries[0],
                    });
                }                
                else {
                    // graph is already displaying a cpe.
                    // ignore summary loading. just switch when another cpe is selected.
                    this.setState({_graphAction: GRAPH_ACTION_NONE});
                }
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
    
    
    // TODO add direct cve search support to cpe dropdown
    // TODO add event listeners to graph nodes
    // TODO add red "Full. Text. Search." to cpe dropdown
    // TODO make word after space search windows_10 AND narrow windows results
    // FIXME page counter not reset when cpe has only 1 cve
    // TODO add mobile only top menu
    // FIXME switch to page one when loading cvelist with fewer cves
    // FIXME limit cpe inventory to 10 active cpes
    // TODO add cache and rate limiting
    // TODO add cookie consent
    // TODO add tutorial
    


    /*
     * Initializes the first CPE list. Triggers loading of CVE summaries for those CPEs. Sets 
     * the first of those CPEs as initial graph display and loads CVEs for graph.
     */
    initSelectedCpes = () => {
        this.setState( {selectedCpes: CpeClient.getExampleCpes(),
                        selectedCpeSummaryForGraph: CpeClient.getExampleCpes()[0],
                        cpeSummaries: CpeClient.getExampleCpes().map( (c) => {
                            return {
                                cpe: c,
                                count: "",
                            };
                        }),
                        _cveAction: CVE_ACTION_RELOAD,
                        _cpeAction: CPE_ACTION_RELOAD,
                        _graphAction: GRAPH_ACTION_RELOAD,
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
    
    initHealthCheck = () => {
        setInterval(this.healthCheck, 5000);    
    }
    
    healthCheck =() => {
            CpeClient.healthCheck( 
                (success) => {
                    if (success && this.state._uhoh) {
                        this.initStats();   
                        this.setState({_uhoh: false});
                    }
                },
                (failure) => {
                    this.setState({_uhoh: true});
                });
    }

    handleSaveClick = () => {
          this.setState({_redirect: REDIRECT_REGISTER});
    }

    handlePaginationChange = (newPage) => {
        this.setState({numCurrentPage: newPage,
            _cveAction: CVE_ACTION_RELOAD,
        });
    }

    handleDeleteCpeClick = (cpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.filter(c => c.id !== cpeId),
            cpeSummaries: this.state.cpeSummaries.filter(cs => cs.cpe.id !== cpeId ),
            _cpeAction: CPE_ACTION_RELOAD,
            _cveAction: CVE_ACTION_RELOAD,
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
                cpeSummaries: [...this.state.cpeSummaries, {cpe: activeCpe, count: ""}],
                _cpeAction: CPE_ACTION_RELOAD,
            });
        }
    }
    
    /*
     * Load CPE by id, then add it.
     */
     // TODO add REST resource for CPEs, query by id
    handleGraphAddCpeClick = (cpeGenericId) => {
        console.log(cpeGenericId);
        // let product = vendorproduct(cpeGeneridId)[0]; //xxx move method to cpes util class from cvegraph
        
        // const escapedValue = escapeRegexCharacters(product.trim());
        // if (escapedValue === '') {
        //     return;
        // }
        
        // CpeClient.getAutoCompleteItems(escapedValue, (cpes) => {
        //     let fullCpes = cpes.filter(c => c.id.indexOf(cpeGenericId) !== -1 );
        //     if (fullCpes.length) {
        //         this.handleAddCpeClick(fullCpes[0]);
        //     }
            
        // })

    } 

    // Load cves and switch to cve display
    handleCpeSummarySelected = (cpeSummary) => {
        this.setState({
            selectedCpeSummary: cpeSummary,
            selectedCpeSummaryForGraph: cpeSummary,
            _cveAction: CVE_ACTION_RELOAD,
            _summaryDisplay: SHOW_SUMMARY_CVE,
            _graphAction: GRAPH_ACTION_RELOAD,
        });
    }
    
    handleDateRangeChanged = (range) => {
        console.log("Range changed: " + range);
        this.setState({
            cveStartDate: range[0],
            cveEndDate: range[1],
            _graphAction: GRAPH_ACTION_RELOAD,
            _cpeAction: CPE_ACTION_RELOAD,
            _cveAction: CVE_ACTION_RELOAD,
        });    
    }

    // Display cve in cve details component:
    handleCveSelected = (cve) => {
        this.setState({
            selectedCve : cve,
            _cveAction: CVE_ACTION_LOAD_DETAILS
        });
    }
    
    loadCveDetails = () => {
        CpeClient.getCveById(this.state.selectedCve.id, (fullCve) => (
            this.setState({
                selectedCve: fullCve,
            })
        ));
    }

    loadCvesPage = () => {
        let pageToGet = this.state.numCurrentPage;
        let cpesLeftAlignedURIBinding = 'cpe' in this.state.selectedCpeSummary
            ? [CVEs.getCpeAsUriBinding(this.state.selectedCpeSummary.cpe)]
            : [];

        if (cpesLeftAlignedURIBinding.length > 0) {
            CpeClient.getCvesForCpes(cpesLeftAlignedURIBinding, 
                itemsPerPage, 
                pageToGet,
                this.state.cveStartDate,
                this.state.cveEndDate, 
                (newCves) => (
                this.setState({
                    selectedCvesPage: newCves.result,
                    selectedCvesTotalCount: newCves.resultCount,
                    numTotalPages : Math.ceil(newCves.resultCount / itemsPerPage),
                })
            ));
        } else {
            this.setState( {
                selectedCvesPage: [],
                selectedCvesTotalCount: 0,
                numTotalPages: 1,
                numCurrentPage: 1,
              
            });
        }
    }
    
    loadGraphData = () => {
        let cpeLeftAlignedURIBinding = 'cpe' in this.state.selectedCpeSummaryForGraph
            ? [CVEs.getCpeAsUriBinding(this.state.selectedCpeSummaryForGraph.cpe)]
            : [];

        if (cpeLeftAlignedURIBinding.length > 0) {
              CpeClient.getCvesByCpesForGraph(cpeLeftAlignedURIBinding,
                this.state.cveStartDate,
                this.state.cveEndDate,
                (newCves) => (
                this.setState({
                    graphCves: newCves.result,
                })
            ));
        }
        else {
            this.setState({
                graphCves: [],
            });
        }
    }


    // load cve summary counts for cpe, only where missing or if date changed
    loadCpeSummaries = () => {
        this.state.cpeSummaries.forEach( (cs) => {
            if ( !Array.isArray(cs.summary) 
                || !cs.summary.length 
                || this.state.lastLoadedEndDate !== this.state.cveEndDate
                || this.state.lastLoadedStartDate !== this.state.cveStartDate) {
                CpeClient.getCveSummaryForCpe(
                    CVEs.getCpeAsUriBinding(cs.cpe),
                    this.state.cveStartDate,
                    this.state.cveEndDate,
                    (response) => {
                        this.setState((prevState, props) => ({
                            cpeSummaries: prevState.cpeSummaries.map((cs2) => {
                                if (cs2.cpe.id === cs.cpe.id) {
                                    return Object.assign({}, cs2, {
                                        summary: response,
                                    });
                                } else {
                                    return cs2;
                                }
                            }),
                            lastLoadedStartDate: prevState.cveStartDate,
                            lastLoadedEndDate: prevState.cveEndDate,
                            _graphAction: GRAPH_ACTION_SUMMARIES_LOADED,
                        }));
                    }
                );
            }
        });
    }

    handleCpeToggleClick = (toggleCpeId) => {
        let toggledCpe = this.state.selectedCpes.find(cpe => cpe.id === toggleCpeId);
        if (!toggledCpe)
            return;

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
            cpeSummaries:  this.state.cpeSummaries.map((cs) => {
               if (cs.cpe.id === toggleCpeId) {
                   return Object.assign({}, cs, {
                       cpe: {...cs.cpe, isActive: !cs.cpe.isActive,}
                   });
               } else {
                   return cs;
               }
            }),
            _cpeAction: CPE_ACTION_RELOAD,
        });
    }

    formatNumber(number) {
        return number ? number.toLocaleString() : number;
    }

    formatDateTime(isoDate) {
        let mom = moment(isoDate, moment.ISO_8601, true);
        return mom.format('YYYY-MM-DD HH:mm (UTC Z)');
    }

    handleEditCpeClick = (editCpeId) => {
        // TODO implement dialog to narrow down cpe by version range, platform etc.
        console.log("Edit " + editCpeId);
    }

    handleHomeClick = () => {
        this.setState({
            _summaryDisplay: SHOW_SUMMARY_CPE,
            selectedCpeSummary: {},
        });
    }

    render() {
        if (this.state._redirect) {
            return {
                REDIRECT_REGISTER: <Redirect to='/register' />
            }[this.state._redirect];
        }
        return (
         <React.Fragment>
          <div class="ui grid">
              <div class="row">
                  <div class="column">
                  {this.state._uhoh
                  ?    <div class="ui red message">
                         <DowntimeTimer/>
                       </div>
                       
                  :    <div class="ui top fixed inverted teal icon menu">
                          <a className="item" href="/homepage.html"><i className="home icon" /></a>
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
                           <Link to="/login" class="item" onClick={this.noop}>
                             <i className="disabled cog icon" />
                           </Link>
                         </div>
                      </div>
                    } 
                      
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
                        allCves={this.state.graphCves} // CVEs loaded for graph
                        currentCpe={'cpe' in this.state.selectedCpeSummaryForGraph // currently selected CPE summary
                            ? this.state.selectedCpeSummaryForGraph.cpe 
                            : ""}
                        activeCpes={this.state.selectedCpes} // marked CPEs
                        cpeSummaries={this.state.cpeSummaries.filter( cs => cs.cpe.isActive) } // all summaries for active CPEs
                        onSelectCpe={this.handleGraphAddCpeClick}
                        onSelectCve={this.handleCveSelected}
                    />
                </div>
            </div>

            <div className='two column row'>
                <div className='five wide column'>

                    <CveDetails
                        cve={this.state.selectedCve}
                    />

                </div>

                <div className='eleven wide column'>
                   <div className='ui raised segment'>
                    <TimerangeSelector 
                        onRangeChange={this.handleDateRangeChanged}
                    />
                   </div>

                   <div className='ui raised segment'>

                        <div class="ui breadcrumb">
                            <a class="section" onClick={this.handleHomeClick}>
                                Home
                            </a>

                           { 'cpe' in this.state.selectedCpeSummary ? (
                               <span>
                                    <i class="right arrow icon divider"></i>
                                    <a class="section"
                                        onClick={this.noop}> 
                                        {this.state.selectedCpeSummary.cpe.id}
                                    </a>
                                </span>
                           ) : ""
                           }

                        { this.state.selectedCve.length ?
                                (
                                    <span>
                                        <i class="right arrow icon divider"></i>
                                        <div class="active section">
                                            {this.state.selectedCve.id}
                                        </div>
                                    </span>
                                ) : ""
                        }
                        </div>
                        <br/><br/>

                        {this.state._summaryDisplay === SHOW_SUMMARY_CPE
                        ?   <SelectableCpeDetailsTable
                                cpesWithCveCounts={this.state.cpeSummaries.filter( cs => cs.cpe.isActive) }
                                onSelect={this.handleCpeSummarySelected}
                            />
                        :
                            <CveList
                                selectedCvesPage={this.state.selectedCvesPage}
                                numTotalPages={this.state.numTotalPages}
                                numCurrentPage={this.state.numCurrentPage}
                                onPaginationChange={this.handlePaginationChange}
                                numTotalCves={this.state.selectedCvesTotalCount}
                                onSelect={this.handleCveSelected}
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
                        <a class="item" href="homepage.html">Home</a>
                        <a class="item" href="legal.html">Legal Notice and Contact</a>
                        <a class="item" target="_blank" href="https://github.com/Agh42/CSTOOL_io"> Source Code</a>
                        <a class="item" target="_blank" href="https://github.com/Agh42/attacksrfc/issues">Report issues</a>
                        <a class="item" target="_blank" href="https://stats.uptimerobot.com/RMwRDtvPLw">Site status</a>
                        <a class="item" target="_blank" href="https://www.reddit.com/r/CSTOOL_io/">Discuss on Reddit</a>
                        <a class="item" target="_blank" href="https://discord.gg/5HWZufA">Join chat</a>
                        
                      </div>
                    </div>
                  </div>
        </React.Fragment>
        );
        }
  }