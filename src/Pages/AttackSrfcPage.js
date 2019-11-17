import React, { Component } from 'react';

import moment from 'moment';
import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CveDetails from '../Components/CveDetails';
import SelectableCpeDetailsTable from '../Components/SelectableCpeDetailsTable';
import CpeClient from '../Gateways/CpeClient';

import {Link, Redirect} from 'react-router-dom';
import { ENGINE_METHOD_NONE } from 'constants';

// cve items displayed per page:
const itemsPerPage = 20;

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

// page load redirects:
const REDIRECT_PRICING = '/pricing';

export default class AttackSrfcPage extends Component {

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
            
            graphCves: [],
            graphCvesTotalCount: 0,

            cpeSummaries: [],
            selectedCpeSummary: {},
            _summaryDisplay: SHOW_SUMMARY_CPE,

            _redirect: "",
            _cveAction: CVE_ACTION_NONE,
            _cpeAction: CPE_ACTION_NONE
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
            case CVE_ACTION_LOAD_DETAILS:
                this.setState({_cveAction: CVE_ACTION_NONE});
                this.loadCveDetails();
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

    // FIXME cvss sort incorrect over multiple CPEs because some cvss are strings
    // FIXME add vendor and product field insert to cvesearch cronjob
    // TODO add iphone, android, windows 10, macos, linux, and adobe reader to example cves
    // TODO add red "Full. Text. Search." to cpe dropdown
    // TODO make word after space search windows_10 AND narrow windows results
    // FIXME page counter not reset when cpe has only 1 cve
    // TODO add mobile only top menu
    // FIXME switch to page one when loading cvelist with fewer cves
    // FIXME limit cpe inventory to 50 cpes


    initSelectedCpes = () => {
        this.setState( {selectedCpes: CpeClient.getExampleCpes(),
                        cpeSummaries: CpeClient.getExampleCpes().map( (c) => {
                            return {
                                cpe: c,
                                count: "",
                            };
                        }),
                        _cveAction: CVE_ACTION_RELOAD,
                        _cpeAction: CPE_ACTION_RELOAD,
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

    // Load cves and switch to cve display
    handleCpeSummarySelected = (cpeSummary) => {
        this.setState({
            selectedCpeSummary: cpeSummary,
            _cveAction : CVE_ACTION_RELOAD,
            _summaryDisplay : SHOW_SUMMARY_CVE,
        });
    }

    // Display cve in cve details component:
    handleCveSelected = (cve) => {
        this.setState({
            selectedCve : cve,
            _cveAction: CVE_ACTION_LOAD_DETAILS
        });
    }


    /*
     * For the query the URI format of the CPE is used (see NISTIR 7695) because this is how CVEs
     * store references to CPEs in the database. This also allows left aligned regex matching to use the database index
     * which speeds up the search significantly.
     *
     */
    getCpeAsUriBinding = (newCpe) => {
        let reCutOff = /(cpe:\/.*?)[:-]*$/; //removes all trailing ":-"
       //create cpe 2.2 by replacing version number:
        let cpe22 = newCpe.id.replace(/2.[23]:/, "/");
        let match = reCutOff.exec(cpe22);
        let cutOffCpe = match ? match[1] : cpe22;
        console.log("Converted CPE to URI format: " + cutOffCpe);
        return cutOffCpe;
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
            ? [this.getCpeAsUriBinding(this.state.selectedCpeSummary.cpe)]
            : [];

        if (cpesLeftAlignedURIBinding.length > 0) {
            CpeClient.getCvesForCpes(cpesLeftAlignedURIBinding, itemsPerPage, pageToGet, (newCves) => (
                this.setState({
                    selectedCvesPage: newCves.result,
                    selectedCvesTotalCount: newCves.resultCount,
                    numTotalPages : Math.ceil(newCves.resultCount / itemsPerPage),
                }))
            );
             
            CpeClient.getCvesByCpesForGraph(cpesLeftAlignedURIBinding, (newCves) => (
                this.setState({
                    graphCves: newCves.result,
                    graphCvesTotalCount: newCves.resultCount,
                }))
            );
        } else {
            this.setState( {
                selectedCvesPage: [],
                selectedCvesTotalCount: 0,
                numTotalPages: 1,
                numCurrentPage: 1,
                graphCves: [],
                graphCvesTotalCount: 0,
            });
        }
    }


    // load cve summary counts for cpe, only where missing:
    loadCpeSummaries = () => {
        this.state.cpeSummaries.forEach( (cs) => {
            if ( !Array.isArray(cs.summary) || !cs.summary.length ) {
                CpeClient.getCveSummaryForCpe(
                    this.getCpeAsUriBinding(cs.cpe),
                    (response) => {
                        this.setState({
                            cpeSummaries: this.state.cpeSummaries.map((cs2) => {
                                if (cs2.cpe.id === cs.cpe.id) {
                                    return Object.assign({}, cs2, {
                                        summary: response,
                                    });
                                } else {
                                    return cs2;
                                }
                            }),

                        });
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
        return mom.format('YYYY-MM-DDTHH:mm') + ' UTC';
    }

    handleEditCpeClick = (editCpeId) => {
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
                        allCves={this.state.graphCves}
                        totalCveCount={this.state.graphCveCount}
                        activeCpes={this.state.selectedCpes}
                        cpeSummaries={this.state.cpeSummaries.filter( cs => cs.cpe.isActive) }
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
                        <a class="item" href="homepage.html#">Home</a>
                        <a class="item" href="legal.html#">Legal Notice and License</a>
                      </div>
                    </div>
                  </div>
        </React.Fragment>
        );
        }
  }

