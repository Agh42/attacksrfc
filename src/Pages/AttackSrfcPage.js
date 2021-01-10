import React, { Component } from 'react';
import { Tab, Button, Icon, Header, Modal } from 'semantic-ui-react';
import { withAuth0 } from "@auth0/auth0-react";

import moment from 'moment';
import store from 'store';

import CveGraph from '../Components/CveGraph';
import EditableInventoryList from '../Components/EditableInventoryList';
import CveList from '../Components/CveList';
import CveDetails from '../Components/CveDetails';
import SelectableCpeDetailsTable from '../Components/SelectableCpeDetailsTable';
import CpeClient from '../Gateways/CpeClient';
import NewsClient from '../Gateways/NewsClient';
import AccountClient from '../Gateways/AccountClient';
import DowntimeTimer from '../Components/DowntimeTimer';
import TimerangeSelector from '../Components/TimerangeSelector';
import CVEs from '../Dto/CVEs.js';
import CPEs from '../Dto/CPEs';
import CookieConsent from '../Components/CookieConsent';
import NewsList from '../Components/NewsList';
import NewsListMenu from '../Components/NewsListMenu';
import LinkToLogin from '../Components/LinkToLogin';

import {Link, Redirect} from 'react-router-dom';
import { ENGINE_METHOD_NONE } from 'constants';

import { Steps, Hints } from 'intro.js-react';

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
const GRAPH_TIMERANGE_CHANGED ='_TIMERANGE_CHANGED';
const GRAPH_TIMERANGE_UNCHANGED ='_TIMERANGE_UNCHANGED';

// page load redirects:
const REDIRECT_REGISTER = 'REDIRECT_REGISTER';
const REDIRECT_LOGIN = 'REDIRECT_LOGIN';

export const ACCOUNT_NONE = "account_none";
export const ACCOUNT_SAVE_DIRTY = "account_dirty";
export const ACCOUNT_SAVE_CLEAN = "account_clean";
export const ACCOUNT_SAVE_SAVING = "account_saving";
export const ACCOUNT_LOADING = "account_loading";


class AttackSrfcPage extends Component {

    
    // used to explicitely disable default actions where needed:
    noop() {
        return undefined;
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
            selectedInventoryName: "<Unsaved inventory...>",
            selectedCve: {},
            articles: [],
            selectedCvesPage: [],
            selectedCvesTotalCount: 0,
            stats: [],
            numTotalPages: 1,
            numCurrentPage: 1,
            cveStartDate: moment().subtract(182, "days"),
            cveEndDate: moment(),

            account: {
                preferences: {
                    notificationsHotTopics: false,
                    notificationsHotTopics: false,
                },
                inventories: [
                    {   name: '<Unsaved inventory...>', 
                        products: [],
                        notify: false,
                    },
                ],
                tenant: {
                    name: "My organization",
                    maxInventories: 1,
                    maxItemsPerInventory: 10
                },
                userInfo: {
                    emailVerified: true,
                }
            },
            _accountStatus: ACCOUNT_NONE,
            wasLoggedIn: false,
            
            graphCves: [],
            selectedCpeSummaryForGraph: {},

            cpeSummaries: [],
            selectedCpeSummary: {},
            _summaryDisplay: SHOW_SUMMARY_CPE,

            hotTopics: [],
            hotTopicsLinks: {},
            hotTopicsPage: {},

            _redirect: "",
            _cveAction: CVE_ACTION_NONE,
            _graphAction: GRAPH_ACTION_NONE,
            _cpeAction: CPE_ACTION_NONE,
            _saveStatus: 'READY',
            _dialogMessage: "",
            _cveDetailsView: 'info',

            activeTabIndex: 0,
            leftActiveTabIndex: 0,

            stepsEnabled: false,
    };

    componentDidMount() {
        if (((this.props.match||{}).params||{}).cveParam) {
            let cve = {id: this.props.match.params.cveParam};
            let view = 'info';
            if (((this.props.match||{}).params||{}).view
                && this.props.match.params.view === 'news') {
                view = 'news';
            }
            this.setState({
                _cveDetailsView: view,
                selectedCve : cve,
                leftActiveTabIndex : 1,
                _cveAction: CVE_ACTION_LOAD_DETAILS,
                stepsEnabled: false
            }, () => {
                this.loadCveDetails();
            });

        }
        this.initHealthCheck();
        this.initSelectedCpes();
        this.initStats();
        this.loadAccount();
        this.loadHotTopics();
        this.autoSaveInterval = setInterval(() => this.autoSave(), 2000);
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
                    // Graph is already displaying a cpe. 
                    this.setState({_graphAction: GRAPH_ACTION_NONE});
                }
                break;
        }
        
        switch (this.state._cpeAction) {
            case CPE_ACTION_RELOAD:
                this.setState({
                    _cpeAction: CPE_ACTION_NONE,
                });
                this.loadCpeSummaries();
                break;
            default:
                break;
        }

        if (this.state._accountStatus === ACCOUNT_NONE) {
            // try loading account again:
            this.loadAccount();
        }
    }

    componentWillUnmount() {
        clearInterval(this.autoSaveInterval);
      }
    
    
    // TODO add direct cve search support to cpe dropdown
    // TODO add event listeners to graph nodes
    // TODO add red "Full. Text. Search." to cpe dropdown
    // TODO make word after space search windows_10 AND narrow windows results
    // FIXME page counter not reset when cpe has only 1 cve
    // TODO add mobile only top menu
    // FIXME switch to page one when loading cvelist with fewer cves
    // TODO add cache and rate limiting
    // TODO add tutorial
    
    /*
     * Initializes the first CPE list. Triggers loading of CVE summaries for those CPEs. Sets 
     * the first of those CPEs as initial graph display and loads CVEs for graph.
     */
    initSelectedCpes = () => {
        if (store.get('selectedCpes') && store.get('selectedCpes').length > 0) {
            var initialCpes = store.get('selectedCpes');
        }
        else {
            var initialCpes = CpeClient.getExampleCpes();
        }

        var stepsEnabled = true;
        if (store.get('stepsDisabled'))
            stepsEnabled = false;

        var newInventories = [ 
            {...this.state.account.inventories[0], products: initialCpes},
            ...this.state.account.inventories.slice(1, this.state.account.inventories.length)
        ];
    
        this.setState( {selectedCpes: initialCpes,
                        selectedCpeSummaryForGraph: initialCpes[0],
                        cpeSummaries: initialCpes.map( (c) => {
                            return {
                                cpe: c,
                                count: "",
                            };
                        }),
                        account: {...this.state.account, inventories: newInventories},
                        _cveAction: CVE_ACTION_RELOAD,
                        _cpeAction: CPE_ACTION_RELOAD,
                        _graphAction: GRAPH_ACTION_RELOAD,
                        stepsEnabled: stepsEnabled,
                    });
    }

    clearStore = () => {
        store.set('selectedCpes', []);
        store.set('stepsDisabled', false);
        this.initSelectedCpes();
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

    loadAccount = () => {
        const { isAuthenticated, getAccessTokenSilently } = this.props.auth0;
        if ( !isAuthenticated || this.state._accountStatus !== ACCOUNT_NONE) return;
        this.setState({
            _accountStatus: ACCOUNT_LOADING,
            stepsEnabled: false,
        });

        getAccessTokenSilently().then(
            this.callApiGetOrCreateAccount
        );
    }

    saveAccount = () => {
        const { isLoading, isAuthenticated, getAccessTokenSilently } = this.props.auth0;
        if (!isAuthenticated) return;

        this.setState({_accountStatus: ACCOUNT_SAVE_SAVING});
        getAccessTokenSilently().then(
            this.callApiSaveAccount
        );
    }

    callApiGetOrCreateAccount = (token) => {
        AccountClient.getAccount(
            (account) => {
                this.setState({
                    account: account,
                    selectedInventoryName: account.inventories[0].name,
                    selectedCpes: account.inventories[0].products,
                    cpeSummaries: account.inventories[0].products.map( (c) => {
                        return {
                            cpe: c,
                            count: "",
                        };
                    }),
                    _cpeAction: CPE_ACTION_RELOAD,
                    _accountStatus: ACCOUNT_SAVE_CLEAN,
                }, this.storeCpes)
            }, token)
            .catch(error => {
                // try to create account:
                AccountClient.saveAccount(
                    this.loadAccount,
                    this.state.account,
                    token,
                    true);
            });
    }

    callApiSaveAccount = (token) => {
        this.setState({_accountStatus: ACCOUNT_SAVE_SAVING});
        AccountClient.saveAccount(
            this.saveSuccessful, 
            this.state.account, 
            token,
            false);
    }

    saveSuccessful = () => {
        this.setState({
          _accountStatus: ACCOUNT_SAVE_CLEAN,
        });
      }

    loadHotTopics =  (link) => {
        NewsClient.getHotTopics( 
            (response) => {
                let articles = ('_embedded' in response) ? response._embedded.articles : [];
                let links = ('_links' in response) ? response._links : {};
                let page = ('page' in response) ? response.page : {};
                this.setState({ 
                    hotTopics: articles,
                    hotTopicsLinks: links,
                    hotTopicsPage: page
                })
            }, 
            link);
    }
    
    initHealthCheck = () => {
        setInterval(this.healthCheck, 5000);    
    }
    
    healthCheck = () => {
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

    autoSave() {
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) return;
        if (this.state._accountStatus !== ACCOUNT_SAVE_DIRTY) return;
        
        this.setState({
            account: {...this.state.account,
                inventories: this.state.account.inventories.map(i => {
                    if (i.name === this.state.selectedInventoryName) {
                        return {...i,
                            products: this.state.selectedCpes,
                        };
                    } else {
                        return i;
                    }
                }),
            },
        }, this.saveAccount);
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
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        }, this.storeCpes);
    }

    /**
     * Check if selected CPE is already present. If not, add it and set its
     * status to active.
     */
    handleAddCpeClick = (newCpe) => {
        if (this.state.selectedCpes.length+1 > this.state.account.tenant.maxItemsPerInventory) {
            const { isAuthenticated } = this.props.auth0;
            if (isAuthenticated) {
                this.setState({
                    _dialogMessage: "This inventory is full. Upgrade your account to increase inventory size.",
                });
            }
            else {
                this.setState({
                    _dialogMessage: "This inventory is full. Sign up to increase "
                                    + "inventory size and to save multiple inventories. It's free!",
                });
            }
        }

        if (this.state.selectedCpes.length > this.state.account.tenant.maxItemsPerInventory) {
            return;
        }
        
        let cpePresent = this.state.selectedCpes.filter(c => c.id === newCpe.id);
        if ( !cpePresent.length ) {
            let activeCpe = {...newCpe, isActive: true};
            this.setState( {
                selectedCpes: [...this.state.selectedCpes, activeCpe],
                cpeSummaries: [...this.state.cpeSummaries, {cpe: activeCpe, count: ""}],
                _cpeAction: CPE_ACTION_RELOAD,
                _accountStatus: ACCOUNT_SAVE_DIRTY,
            }, this.storeCpes);
            
        }
    }

    storeCpes = () => {
        store.set('selectedCpes', this.state.selectedCpes);
        store.set('stepsDisabled', true);
    }
    
    /*
     * Load CPE by id, then add it.
     */
     // TODO add REST resource for CPEs, query by id
    handleGraphAddCpeClick = (cpeGenericId) => {
        //console.log(cpeGenericId);
        let product = CPEs.vendorProduct(cpeGenericId).split(" ")[1];
        
        const escapedValue = CPEs.escapeRegexCharacters(product.trim());
        if (escapedValue === '') {
            return;
        }
        
        CpeClient.getAutoCompleteItems(escapedValue, (cpes) => {
            let fullCpes = cpes.filter(c => c.id.indexOf(cpeGenericId) !== -1 );
            if (fullCpes.length) {
                this.handleAddCpeClick(fullCpes[0]);
            }
        })
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
    
    // change date range, reload affected components
    handleDateRangeChanged = (range) => {
        //console.log("Range changed: " + range);
        this.setState({
            cveStartDate: range[0],
            cveEndDate: range[1],
            _cpeAction: CPE_ACTION_RELOAD,
            _cveAction: CVE_ACTION_RELOAD,
        });    
    }

    // Display cve in cve details component:
    handleCveSelected = (cve) => {
        this.setState({
            selectedCve : cve,
            leftActiveTabIndex : 1,
            _cveAction: CVE_ACTION_LOAD_DETAILS
        });
    } // TODO add route for CPE next to CVE
    
    loadCveDetails = () => {
        CpeClient.getCveById(this.state.selectedCve.id, (fullCve) => {
            if ( Object.keys(fullCve).length !== 0 ) {
                this.setState({
                    selectedCve: fullCve,
                })
            }
        });
        NewsClient.getArticles(this.state.selectedCve.id, (response) => {
            let articles = ('_embedded' in response) ? response._embedded.articles : [];
            this.setState({ articles: articles })
        });
        if (this.state._cveDetailsView === 'info')
            this.props.history.push('/cve/' + this.state.selectedCve.id);
        else
            this.props.history.push('/cve/' + this.state.selectedCve.id + '/news');
    }

    handleCveDetailsViewChange = (view) => {
        if (view === 'info')
            this.props.history.push('/cve/' + this.state.selectedCve.id);
        else
            this.props.history.push('/cve/' + this.state.selectedCve.id + '/news');
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

    timeRangeHasChanged = (oldEnd, newEnd, oldStart, newStart) => {
        return oldEnd !== newEnd || oldStart !== newStart;
    }

    // load cve summary counts for cpe, only where missing or if date changed
    loadCpeSummaries = () => {
        var timeChanged = this.timeRangeHasChanged(
            this.state.lastLoadedEndDate, this.state.cveEndDate,
            this.state.lastLoadedStartDate, this.state.cveStartDate);

        this.state.cpeSummaries.forEach( (cs) => {
            if ( ! ('summary' in cs)
                || (Object.keys(cs.summary).length === 0) 
                || timeChanged) {
                CpeClient.getCveSummaryForCpe(
                    CVEs.getCpeAsUriBinding(cs.cpe),
                    this.state.cveStartDate,
                    this.state.cveEndDate,
                    (response) => {this.handleSummariesLoaded(response, cs, timeChanged)}
                );
            }
        });
    }

    handleSummariesLoaded = (response, cpeSummary, timeChanged) => {
        // merge loaded summaries into state and trigger graph reload:
        this.setState((prevState, props) => ({
            cpeSummaries: prevState.cpeSummaries.map((cs2) => {
                if (cs2.cpe.id === cpeSummary.cpe.id) {
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

        if (timeChanged
            && cpeSummary.cpe.id === this.state.selectedCpeSummaryForGraph.cpe.id) {
            // Reload graph if event is for current cpe and timerange changed:
            // FIXME put in redux event handling and use event source for this
            this.setState({
                _graphAction: GRAPH_ACTION_RELOAD,
            });
        }
    }

    handleNewsCveSelected = (cveId) => {
        let cve = {id: cveId};
        this.setState({
            selectedCve : cve,
            leftActiveTabIndex : 1,
            _cveAction: CVE_ACTION_LOAD_DETAILS
        }, () => {
            this.loadCveDetails();
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
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        }, this.storeCpes);
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

    handleSelectInventoryClick = (name) => {
        let newCpeList = this.state.account.inventories.find(i => i.name === name).products;
        this.setState({
            selectedCpes: newCpeList,
            selectedInventoryName: name,
            cpeSummaries: newCpeList.map( (c) => {
                return {
                    cpe: c,
                    count: "",
                };
            }),
            _cpeAction: CPE_ACTION_RELOAD,
        }, this.storeCpes);
    }

    handleNewsListMenuClick = (link) => {
        this.loadHotTopics(link);
    }

    handleHomeClick = () => {
        this.setState({
            _summaryDisplay: SHOW_SUMMARY_CPE,
            selectedCpeSummary: {},
            numCurrentPage: 1,
            leftActiveTabIndex: 0,
        });
    }
    
    handleListSave = () => {
        this.setState({
            _saveStatus : 'SAVED',
        });
        
        setTimeout(() => {
            this.setState({
                _saveStatus : 'READY',
            });
        }, 2000);
        
    }

    handleTabChange = (e, { activeIndex }) => {
        console.log("tabchange:" + activeIndex);
        this.setState({ activeTabIndex: activeIndex });
    }

    handleLeftTabChange = (e, { activeIndex }) => {
        console.log("lefttabchange:" + activeIndex);
        this.setState({ leftActiveTabIndex: activeIndex });
    }

    handleAddInventoryClick = (name) => {
        if (this.state.account.inventories.length >= this.state.account.tenant.maxInventories) {
            this.setState({_redirect: REDIRECT_REGISTER});
            return;
        }

        var i=1;
        while (this.state.account.inventories.find(i => i.name === name)) {
            //avoid dup name
            name = name + "_" + i++;
        }

        let newInventories = [...this.state.account.inventories,
            {
                name: name,
                products: [],
                notify: false,
            }
        ];
        this.setState({
            account: {...this.state.account, 
                inventories: newInventories,
            },
            selectedInventoryName: name,
            selectedCpes: [],
            cpeSummaries: [],
            _cpeAction: CPE_ACTION_RELOAD,
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        });
    }

    handleDeleteInventoryClick = () => {
        if (this.state.account.inventories.length<2)
            return;
        var newInventories = this.state.account.inventories.filter(
            i => (i.name !== this.state.selectedInventoryName)
        );
        this.setState({
            account: {...this.state.account, 
                inventories: newInventories,
            },
            selectedInventoryName: newInventories[0].name,
            selectedCpes: newInventories[0].products,
            cpeSummaries: newInventories[0].products.map( (c) => {
                return {
                    cpe: c,
                    count: "",
                };
            }),
            _cpeAction: CPE_ACTION_RELOAD,
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        });
    }

    handleRenameInventoryClick = (newname) => {
        // only rename first found - safety to be able to resolve dups
        var doRename=true;
        this.setState({
            account: {...this.state.account,
                inventories: this.state.account.inventories.map((i) => {
                    if (doRename && i.name === this.state.selectedInventoryName) {
                        doRename=false;
                        return {...i, name: newname};
                    } else {
                        return i;
                    }
                })
            },
            selectedInventoryName: newname,
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        });
    }

    handleInventoryNotificationClick = () => {
        const { isAuthenticated } = this.props.auth0;
        if (this.state._accountStatus === ACCOUNT_NONE || !isAuthenticated) {
            this.setState({_redirect: REDIRECT_REGISTER});
            return;
        }
        this.setState({
            account: {...this.state.account, 
                inventories: this.state.account.inventories.map( (i) => {
                    if (i.name === this.state.selectedInventoryName) {
                        return {...i, notify: !i.notify};
                    } else {
                        return i;
                    }
                }),
            },
            _accountStatus: ACCOUNT_SAVE_DIRTY,
        });
    }

    handleSaveInventoryClick = () => {
        if (this.state._accountStatus === ACCOUNT_NONE) {
            this.setState({_redirect: REDIRECT_REGISTER});
            return;
        }

        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated && this.state._accountStatus === ACCOUNT_SAVE_DIRTY) {
            this.setState({_redirect: REDIRECT_REGISTER});
            return;
        }

        this.setState({
            account: {...this.state.account,
                inventories: this.state.account.inventories.map(i => {
                    if (i.name === this.state.selectedInventoryName) {
                        return {...i,
                            products: this.state.selectedCpes,
                        };
                    } else {
                        return i;
                    }
                }),
            },
        }, this.saveAccount);
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
      };

    render() {
        if (this.state._redirect) {
            return {
                REDIRECT_REGISTER: <Redirect to='/register' />,
                REDIRECT_LOGIN: <Redirect to='/login' />
            }[this.state._redirect];
        }

        const leftTabPanes = [
            {   menuItem: { key: 'invtab', icon: 'archive', content: 'Inv.' }, 
                pane:
                <Tab.Pane >
                    <EditableInventoryList 
                        inventories={this.state.account.inventories}
                        maxInventories={this.state.account.tenant.maxInventories}
                        maxCpes={this.state.account.tenant.maxItemsPerInventory}
                        selectedCpes={this.state.selectedCpes}
                        selectedInventoryName={this.state.selectedInventoryName}
                        onSelectCpeClick={this.handleAddCpeClick}
                        onSaveInventoryClick={this.handleSaveInventoryClick}
                        onDeleteClick={this.handleDeleteCpeClick}
                        onCpeToggleClick={this.handleCpeToggleClick}
                        onEditCpeClick={this.handleEditCpeClick}
                        onSelectInventoryClick={this.handleSelectInventoryClick}
                        onAddInventoryClick={this.handleAddInventoryClick}
                        onDeleteInventoryClick={this.handleDeleteInventoryClick}
                        onToggleNotificationClick={this.handleInventoryNotificationClick}
                        onRenameInventoryClick={this.handleRenameInventoryClick}
                        accountStatus={this.state._accountStatus}
                    />
                </Tab.Pane>
            }, {
                menuItem: { key: 'vulntab', icon: 'bug', content: 'Vuln.' }, 
                pane:
                <Tab.Pane >
                    <CveDetails
                        cve={this.state.selectedCve}
                        activeView={this.state._cveDetailsView}
                        articles={this.state.articles}
                        onNewsCveSelected={this.handleNewsCveSelected}
                        onCveDetailsViewChange={this.handleCveDetailsViewChange}
                    />
                </Tab.Pane>
            }, {
                menuItem:  { key: 'hottopics', icon: 'red fire', content: 'Hot Topics', className: 'tipselector4' }, 
                pane:
                <Tab.Pane >
                    <NewsListMenu
                        links={this.state.hotTopicsLinks}
                        page={this.state.hotTopicsPage}
                        onSelect={this.handleNewsListMenuClick}
                    />
                    <div className='ui raised segments'
                        style={{overflow: 'auto', "height":"52em"}}
                    >
                        <div className='ui segment'>
                            <NewsList
                                articles={this.state.hotTopics}
                                onCveSelected={this.handleNewsCveSelected}
                            />
                        </div>
                    </div>
                </Tab.Pane>
            }
        ];

        const panes = [
            {   menuItem: 'Summary', 
                pane: 
                <Tab.Pane >
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
                            cpesWithCveCounts={this.state.cpeSummaries.filter( cs => cs.cpe.isActive)}
                            onSelect={this.handleCpeSummarySelected}
                            _status={this.state._saveStatus}
                            onSave={this.handleListSave}
                        
                        />
                    :
                        <CveList
                            selectedCvesPage={this.state.selectedCvesPage}
                            numTotalPages={this.state.numTotalPages}
                            numCurrentPage={this.state.numCurrentPage}
                            onPaginationChange={this.handlePaginationChange}
                            numTotalCves={this.state.selectedCvesTotalCount}
                            onSelect={this.handleCveSelected}
                            _status={this.state._saveStatus}
                            onSave={this.handleListSave}
                        />
                    }
                </Tab.Pane>
                        
                
            },
            {   menuItem: { key: 'graph', content: 'Graph', className: 'tipselector3' }, 
                pane:
                <Tab.Pane>
                    <CveGraph
                        maxCpesReached={this.state.selectedCpes.length > this.state.account.tenant.maxItemsPerInventory}
                        allCves={this.state.graphCves} // CVEs loaded for graph
                        currentCpe={'cpe' in this.state.selectedCpeSummaryForGraph // currently selected CPE summary
                            ? this.state.selectedCpeSummaryForGraph.cpe 
                            : {}}
                        activeCpes={this.state.selectedCpes} // marked CPEs
                        cpeSummaries={this.state.cpeSummaries.filter( cs => cs.cpe.isActive) } // all summaries for active CPEs
                        onSelectCpe={this.handleGraphAddCpeClick}
                        onSelectCve={this.handleCveSelected}
                        isVisible={this.state.activeTabIndex===1}
                    />
                </Tab.Pane>
            }, 
        ]

        const steps = [
            {  
                element: '.tipselector1',
                intro: 'Welcome! This is your inventory of software and hardware. Search for products to add them to the list.',
            },
            {
                element: '.tipselector2',
                intro: 'These are the known vulnerabilities for your inventory. Select a product to list its '
                    + 'vulnerabilities. Pay attention to vulnerabilities that have known exploits or that made '
                    + 'it into the news!',
            },
            {
                element: '.tipselector3',
                intro: '"Graph" shows how one vulnerable product affects others. You can zoom in, drag items '
                    + 'select vulnerabilities and click to add affected products to the inventory.',
            },
            {
                element: '.tipselector4',
                intro: '"Hot topics" lists vulnerabilities that were mentioned in recent news. You can jump '
                    + 'to the related vulnerabilities from there.',
            },
        ];

        return (
         <React.Fragment>

            <Steps
                enabled={this.state.stepsEnabled && !this.state._uhoh && this.state.leftActiveTabIndex===0}
                steps={steps}
                initialStep={0}
                onExit={this.onExit}
            />

         <div class="ui fluid container">

         
            <div class="ui padded grid">
                    <div class="one column row">
                        <div class="sixteen wide column">
                            {this.state._uhoh
                            ?    <div class="ui red message">
                                    <DowntimeTimer/>
                                </div>
                                
                            :    <div class="ui top fixed inverted teal icon menu"
                                    style={{overflow: 'auto'}}
                                >
                                    <a className="item" href="/homepage.html"><i className="home icon" /></a>
                                    <div className="ui item"><h4 className="ui left aligned inverted header">
                                        AttackSrfc - CVE Search and Vulnerability Management (beta)
                                        <div className="sub header">
                                        Tracking: {this.formatNumber(this.state.stats.cpeCount)} Product Versions - {this.formatNumber(this.state.stats.cveCount)} Vulnerabilities
                                        - Last updated: {this.formatDateTime(this.state.stats.lastModified)}
                                        </div>
                                        </h4>
                                    </div>
                                
                                    <CookieConsent/>
                                    
                                    <div class="right menu primary">
                                    <LinkToLogin 
                                        emailVerified={
                                            (this.state.account.userInfo||{}).emailVerified
                                        }
                                        onSignOut={this.clearStore}
                                    />
                                    </div>
                                </div>
                            } 
                        </div> {/* end col */}
                    </div> {/* end row */}
                    <div class="row">
                        <div class="sixteen wide column">
                        <div className='ui stackable grid'>
                            <div className='two column row'>
                                <div className='five wide column'>
                                    <Tab 
                                        panes={leftTabPanes} 
                                        renderActiveOnly={false} 
                                        activeIndex={this.state.leftActiveTabIndex}
                                        onTabChange={this.handleLeftTabChange}
                                        />
                                
                                </div>

                                <div className='eleven wide column'>
                                    <div className='ui grid'>
                                        <div className='ui column'>
                                        
                                            <div className='ui row'>
                                                <div className='ui raised segment'>
                                                    <TimerangeSelector 
                                                        onRangeChange={this.handleDateRangeChanged}
                                                    />
                                                </div>
                                            </div>

                                            <div className='ui row'>
                                                <div className='ui raised segment'
                                                    style={{overflow: 'auto', "height":"49em"}}
                                                >
                                                    <Tab 
                                                        panes={panes} 
                                                        renderActiveOnly={false} 
                                                        activeIndex={this.state.activeTabIndex}
                                                        onTabChange={this.handleTabChange}
                                                        />

                                                </div>
                                            </div> {/*end row */}
                                        </div> {/* end nested grid single column*/}
                                    </div> {/*end nested grid*/}
                                </div> {/* end stackable grid middle column*/}
                            </div> {/* end stackable grid row*/}
                        </div> {/* end stackable grid*/}
                        </div> {/* end col */}
                    </div> {/* end row */}
            </div> {/* end grid */}
            </div>

            

        <Modal basic size='small'
                open={this.state._dialogMessage !== ""}>
            <Header icon='archive' content='Inventory full' />
            <Modal.Content>
                <p>
                {this.state._dialogMessage}
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' inverted 
                    onClick={() => this.setState({_dialogMessage: ""})}>
                <Icon name='checkmark' /> Got it
                </Button>
            </Modal.Actions>
            </Modal>

            <div class="ui  vertical footer segment">
            <div class="ui center aligned container">


                <div class="ui  section divider"></div>
                <a className="item" href="/homepage.html">
                <img class="ui centered image" src="images/logos/cstoolio_60.png" />
                </a>
                <div class="ui horizontal  small divided link list">
                <a class="item" href="homepage.html">Home</a>
                <a class="item" href="legal.html">Legal Notice and Contact</a>
                <a class="item" target="_blank" rel="noopener noreferrer" href="https://github.com/Agh42/CSTOOL_io"> Source Code</a>
                <a class="item" target="_blank" rel="noopener noreferrer" href="https://github.com/Agh42/attacksrfc/issues">Report issues</a>
                <a class="item" target="_blank" rel="noopener noreferrer" href="https://stats.uptimerobot.com/RMwRDtvPLw">Site status</a>
                <a class="item" target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/CSTOOL_io/">Discuss on Reddit</a>
                <a class="item" target="_blank" rel="noopener noreferrer" href="https://discord.gg/5HWZufA">Join chat</a>
                
                </div>
            </div>
            </div>
        </React.Fragment>
        );
        }
  }

  export default withAuth0(AttackSrfcPage);