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
        ? cpeId.split(":")[3] + " " + cpeId.split(":")[4]
        : cpeId.split(":")[2] + " " + cpeId.split(":")[3];
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

 static propTypes = {
        allCves: PropTypes.object.isRequired,
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
        allCves.forEach( (cve) => {
            //console.log("CVE for graph: ");
            //console.log(cve);
            if (!cve.hasOwnProperty('vulnerable_product')) {
                return;
            }

            // Add nodes for CVEs with score:
            //group++;
            this.nodes.add( {id: cve.id, 
                label: cve.cvss.toString(), 
                title: cve.id,
                color: CVEs.colorValueForScore(cve.cvss) } );
            
            let primaryCpe='';
            let summaryNodes = {};

            // determine primary cpe for this cve:
            // (primay cpe is one selected by the user)
            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vendorProduct(vulnerableCpe);
                if (!primaryCpe && userSelectedCpes.has(vendor_product)) {
                    primaryCpe = vendor_product;
                }
            });
            
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

            // add all other vulnerable CPEs:
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
                const vendor_product = cpe.split(":")[3] + " " + cpe.split(":")[4];
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
                // link them to the primary cpe:
                if (!createdEdges.has(primaryCpe+vendor_product)
                        && !(primaryCpe===vendor_product)) {
                    this.edges.add( {from: primaryCpe, to: vendor_product} );
                    //console.log("add cpe edge: " + primaryCpe + "---" + vendor_product);
                    createdEdges.add(primaryCpe + vendor_product);
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
        };
        
        this.convertCves(props);
        let container = document.getElementById('cvegraph');
        new vis.Network(container, this.data, options);
    } 
    
    componentDidMount() {
        this.initGraph(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.allCves.length != this.props.allCves.length
            || !nextProps.allCves.every(el => this.props.allCves.includes(el)) ) {
            console.log("graph will receive props: ");
            console.log(nextProps);
            this.initGraph(nextProps);
        }
    }
            
    render() {
        return (
            <React.Fragment>
                <div className='ui raised segment' style={{"height":"30em"}}>
                    <div id="cvegraph" style={{"height":"100%"}}></div>
                </div>
            </React.Fragment>
        );
    }
}