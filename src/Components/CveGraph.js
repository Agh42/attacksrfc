import React, { Component } from 'react';
import * as vis from 'vis';
import PropTypes from 'prop-types';
import CVEs from '../Dto/CVEs';
import {COLOR_AMBER, COLOR_GREEN, COLOR_RED} from '../Dto/CVEs';


function getCpesGenericForm(cpes) {
    let result = new Set();
    cpes.forEach( (cpe) => {
        if (cpe.isActive) {
            result.add(vendorProduct(cpe.id));
        }
    });
    return result;
}

/**
 * Return vendor and product depending on cpe format.
 * 
 * @param {string} cpeId 
 */
function vendorProduct(cpeId) {
    return (cpeId.split(":")[1].match(/\d.\d/))
        ? decodeCPE(cpeId.split(":")[3] + " " + cpeId.split(":")[4])
        : decodeCPE(cpeId.split(":")[2] + " " + cpeId.split(":")[3]);
}

function decodeCPE(cpeId) {
    return decodeURIComponent(cpeId).replace(/\\!/g, "!");
}

/**
 * Test if a summary node exists for the given severity. If not, checks if one should exist.
 * 
 * @param {Object} cpeSummary a cve summary entry to check for existence of a matching severity count
 * @param {Object[]} createdNodes all nodes created so far
 * @param {string} primaryCpe cpe id of the primary cpe (selected by the user)
 * @param {string} severity the severity level (CRITICAL, HIGH, ...)
 */
function needToCreateSummaryNode(cpeSummary, createdNodes, primaryCpe, severity) {
    if (createdNodes.has(primaryCpe+" "+severity))
        return false;
    
    if ('summary' in cpeSummary && severity in cpeSummary.summary)
        return true;
    
    return false;
}

function createSummaryNode(primaryCpe, severity, count, scoreColor) {
    let node = {
        id: primaryCpe+" "+severity, 
        label: count.toString(), 
        title: "Filter matches " + count + " " + severity + " CVEs. (Only the top 100 CVEs for each product are shown individually.)",
        color: scoreColor,
        shape: "circle",
        value: count,
        scaling: {
            min: 10,
            max: 50,
            label: {
                enabled: true,
                min: 20,
                max: 40
            }
        } 
    };
    return node;
}

/**
 * Returns an id for the correct summary node for a CVE.
 * 
 * @param {Object} cve the source CVE
 * @param {string} primaryCpe the target product id
 * @returns {string} 
 */
function determineCveTargetNodeId(cve, primaryCpe) {
    return primaryCpe + " " + CVEs.severityForScore(cve.cvss);
}


export default class CveGraph extends Component {

    constructor() {
        super();
        this.state = {
                _loadingbar: false,
        }
    }

 static propTypes = {
        allCves: PropTypes.object.isRequired,
        currentCpe: PropTypes.object.isRequired,
        activeCpes: PropTypes.object.isRequired,
        cpeSummaries: PropTypes.object.isRequired
    };


   data;
   nodes;
   edges;
   
    convertCves= (props) => {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = props.allCves || [];
        const userSelectedCpes = getCpesGenericForm(props.activeCpes);
        //let group = -1;
        
        let createdEdges = new Set();
        let createdNodes = new Set();
        // add node for primary cpe:
        let primaryCpe = vendorProduct(props.currentCpe.id);
        this.nodes.add({
            id: primaryCpe, 
            shape: 'box',
            color: '#00b5ad',
            font: {color: '#ffffff'},
            label: primaryCpe
        });
        createdNodes.add(primaryCpe);
        
        // add group node for vulnerable configurations:
        this.nodes.add({
            id: 'vulnConfig', 
            shape: 'box',
            color: '#0062B5',
            font: {color: '#ffffff'},
            title: "These products may also be affected if they are used in a configuration together with the vulnerable product.",
            label: 'Affected'
        });
        createdNodes.add('vulnConfig');
        this.edges.add( {from: 'vulnConfig', to: primaryCpe} );
        createdEdges.add('vulnConfig' + primaryCpe);

        // iterate over all CVEs:
        allCves.forEach( (cve) => {
            //console.log("CVE for graph: ");
            //console.log(cve);
            if (!cve.hasOwnProperty('vulnerable_product')) { // debug: reason for orphaned cpes?
                return;
            }

            // Add node for CVE with score:
            //group++;
            this.nodes.add({
                id: cve.id, 
                label: cve.cvss.toString(), 
                title: cve.id,
                color: CVEs.colorValueForScore(cve.cvss) 
            });
            
            let summaryNodes = {};

            
            // add summary nodes with severity count for primary cpe:
             props.cpeSummaries.forEach( (cs) => {
                if (vendorProduct(cs.cpe.id) === primaryCpe) {
                    if ( needToCreateSummaryNode(cs, createdNodes, primaryCpe, "CRITICAL") ) {
                        summaryNodes.CRITICAL = createSummaryNode(primaryCpe, "CRITICAL", cs.summary.CRITICAL, COLOR_RED);
                        this.nodes.add(summaryNodes.CRITICAL);
                        this.edges.add( {from: summaryNodes.CRITICAL.id, to: primaryCpe} );
                        createdNodes.add(primaryCpe + " " + "CRITICAL");
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpe, "HIGH") ) {
                        summaryNodes.HIGH = createSummaryNode(primaryCpe, "HIGH", cs.summary.HIGH, COLOR_RED);
                        this.nodes.add(summaryNodes.HIGH);
                        this.edges.add( {from: summaryNodes.HIGH.id, to: primaryCpe} );
                        createdNodes.add(primaryCpe + " " + "HIGH");
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpe, "MEDIUM") ) {
                        summaryNodes.MEDIUM = createSummaryNode(primaryCpe, "MEDIUM", cs.summary.MEDIUM, COLOR_AMBER);
                        this.nodes.add(summaryNodes.MEDIUM);
                        this.edges.add( {from: summaryNodes.MEDIUM.id, to: primaryCpe} );
                        createdNodes.add(primaryCpe + " " + "MEDIUM");
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpe, "LOW") ) {
                        summaryNodes.LOW = createSummaryNode(primaryCpe, "LOW", cs.summary.LOW, COLOR_GREEN);
                        this.nodes.add(summaryNodes.LOW);
                        this.edges.add( {from: summaryNodes.LOW.id, to: primaryCpe} );
                        createdNodes.add(primaryCpe + " " + "LOW");
                    }
                }
             });

            // add vulnerable product CPEs:
            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vendorProduct(vulnerableCpe);
                //console.log("vend_prod from vulnprod: " + vendor_product);
                if (!createdNodes.has(vendor_product)) {
                
                
                    let color = (primaryCpe === vendor_product) ? '#00b5ad' : '#c0c0c0';
                    
                    this.nodes.add({
                        id: vendor_product, 
                        shape: 'box',
                        color: color,
                        font: {color: '#ffffff'},
                        label: vendor_product
                    });
                    createdNodes.add(vendor_product);
                }
            });

             // link cve node to summary node with correct criticality:
             let cveTargetNodeId = determineCveTargetNodeId(cve, primaryCpe);
             if (!createdEdges.has(cve.id + cveTargetNodeId)) {
                 //targetNode = determineTargetNode(summaryNodes, cve);
                 this.edges.add( {from: cve.id, to: cveTargetNodeId} );
                 createdEdges.add(cve.id + cveTargetNodeId);
             }

            // add all CPEs for vulnerable configurations:
            cve.vulnerable_configuration.forEach( (cpe) => {
                const vendor_product = vendorProduct(cpe);
                //console.log("Vend_prod from vulnConf: " +vendor_product);

                if (!createdNodes.has(vendor_product)) {
                    let color = '#c0c0c0';
                    //console.log("adding vulnconf: " + vendor_product);
                    this.nodes.add( {id: vendor_product, 
                        shape: 'box',
                        color: color,
                        font: {color: '#ffffff'},
                        label: vendor_product} );
                    createdNodes.add(vendor_product);
                }
                // link them to the vulnconfig node for the primary cpe:
                if (!createdEdges.has('vulnConfig'+vendor_product)
                        && !(primaryCpe===vendor_product)) {
                    this.edges.add( {from: 'vulnConfig', to: vendor_product} );
                    //console.log("add cpe edge: " + primaryCpe + "---" + vendor_product);
                    createdEdges.add('vulnConfig' + vendor_product);
                }
                
            });
        });
        //provide the data in the vis format
        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };
    }
    
    initGraph= (props) => {
        var options = {
                autoResize: true,
                height: '100%',
                width: '100%',
                nodes: {borderWidth: 2, shadow: true},
                edges: {width: 2, 
                    shadow: true},
                interaction: {hover: false},
                //layout: {randomSeed:44},
                //smoothCurves: {dynamic:false, type: "continuous"},
               /*  stabilization: false,
                physics: {barnesHut: {
                    gravitationalConstant: -5000, 
                    centralGravity: 0.3,
                    springLength: 120, 
                    springConstant: 0.04,
                    avoidOverlap: 0.1
                }}, */
        };
        this.setState({_loadingbar: true});
        this.convertCves(props);
        let container = document.getElementById('cvegraph');
        this.network = new vis.Network(container, this.data, options);
        this.network.on("stabilizationProgress", function(params) {
            var maxWidth = 496;
            var minWidth = 20;
            var widthFactor = params.iterations/params.total;
            var width = Math.max(minWidth,maxWidth * widthFactor);

            document.getElementById('bar').style.width = width + 'px';
            document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%';
        });
        var component = this;
        this.network.once("stabilizationIterationsDone", function() {
            document.getElementById('text').innerHTML = '100%';
            document.getElementById('bar').style.width = '496px';
            document.getElementById('loadingBar').style.opacity = 0;
            // really clean the dom element
            //setTimeout(function () {document.getElementById('loadingBar').style.display = 'none';}, 500);
            setTimeout( () => 
                component.setState({_loadingbar: false})
            , 500);
        });

    } 
    
    showPlaceholder = () => {
        let container = document.getElementById('cvegraph');
        if (container !== null) {
            this.network = new vis.Network(container, {}, {});
        }
        // todo show loading indicator
    
    }
    
    componentDidMount() {
        this.showPlaceholder();
    }
    
    // update only when allCves changes and all other properties are present as well:
    componentWillReceiveProps(nextProps) {
        if (nextProps.allCves.length === 0){
               this.showPlaceholder();
               return;
        }
        if (!nextProps.allCves.every(el => this.props.allCves.includes(el))
            && 'id' in nextProps.currentCpe
            && nextProps.activeCpes.length > 0
            && nextProps.cpeSummaries.length > 0
        ) {
            console.log("graph will receive props: ");
            console.log(nextProps);
            //this.showPlaceholder = false;
            this.initGraph(nextProps);
        }
    }
            
    render() {
        return (
            <React.Fragment>
                <div className='ui raised segment' style={{"height":"30em"}}>
                    <div id="cvegraph" style={{"height":"100%"}}></div>
                    {this.state._loadingbar
                    ? <div id="loadingBar" >
                        <div class="outerBorder" >
                            <div id="text" >0%</div>
                            <div id="border" >
                                <div id="bar" ></div>
                            </div>
                        </div>
                      </div>
                    : ""}

                </div>
            </React.Fragment>
        );
    }
}
