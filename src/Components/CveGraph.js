import React, { Component } from 'react';
import * as vis from 'vis';
import PropTypes from 'prop-types';
import CVEs from '../Dto/CVEs';
import CPEs from '../Dto/CPEs';
import {COLOR_AMBER, COLOR_GREEN, COLOR_ORANGE, COLOR_RED} from '../Dto/CVEs';


const COLOR_TEAL = '#00b5ad';
const COLOR_WHITE = '#ffffff';
const COLOR_GREY = '#e8e8e8';
const COLOR_DARK_GREY = '#7c7c7c';
const MAX_CPES = 50;

function getActiveCpesGenericForm(cpes) {
    let result = new Set();
    cpes.forEach( (cpe) => {
        if (cpe.isActive) {
            result.add(CVEs.getCpeAsUriBinding(cpe.id));
        }
    });
    return result;
}



/**
 * Test if a summary node exists for the given severity. If not, checks if one should exist.
 * 
 * @param {Object} cpeSummary a cve summary entry to check for existence of a matching severity count
 * @param {Object[]} createdNodes all nodes created so far
 * @param {string} primaryCpeId cpe id of the primary cpe (selected by the user)
 * @param {string} severity the severity level (CRITICAL, HIGH, ...)
 */
function needToCreateSummaryNode(cpeSummary, createdNodes, primaryCpeId, severity) {
    if (createdNodes.has(severity + "_" + primaryCpeId))
        return false;
    
    if ('summary' in cpeSummary && severity in cpeSummary.summary)
        return true;
    
    return false;
}

function createSummaryNode(primaryCpeId, severity, count, scoreColor) {
    let node = {
        id: severity + "_" + primaryCpeId, 
        label: severity + ": " + count.toString(), 
        title: "Filter matches " + count + " " + severity 
            + " CVEs. (Only the top 100 CVEs for each product are shown individually.)",
        color: scoreColor,
        shape: "box",
        value: count,
        scaling: {
            min: 20,
            max: 50,
            label: {
                enabled: true,
                min: 14,
                max: 23
            }
        } 
    };
    return node;
}

function renderMaxCpeCountNode() {
    let node = {
        id: "maxCpeCountNode", 
        label: "...", 
        title: "Product limit reached. Only the first " + MAX_CPES + " products are shown.",
        color: COLOR_GREY,
        shape: "circle"
    };
    return node;
}

/**
 * Returns an id for the correct summary node for a CVE.
 * 
 * @param {Object} cve the source CVE
 * @param {string} primaryCpeId the target product id
 * @returns {string} 
 */
function determineCveTargetNodeId(cve, primaryCpeId) {
    return CVEs.severityForScore(cve.cvss) + "_" + primaryCpeId;
}

export default class CveGraph extends Component {

    constructor() {
        super();
        this.state = {
                _loadingbar: false,
        }
    }

 static propTypes = {
        allCves: PropTypes.array.isRequired,
        currentCpe: PropTypes.object.isRequired,
        activeCpes: PropTypes.array.isRequired,
        cpeSummaries: PropTypes.array.isRequired,
        onSelectCpe: PropTypes.func.isRequired,
        onSelectCve: PropTypes.func.isRequired,
    };


   data;
   nodes;
   edges;
   cpeCount = 0;
   
   
    onCveNodeSelected = (cveId) => {
        this.props.onSelectCve({
            id: cveId,
        });
    }
    
    onCpeNodeSelected = (genericCpeId) => {
        this.props.onSelectCpe(genericCpeId);
    }
   
    cpeNodeColor = (cpeId) => {
        let cpePresent = this.props.activeCpes.filter(ac => ac.id.indexOf(cpeId) !== -1);
        return cpePresent.length ? COLOR_TEAL : COLOR_GREY;
    }
    
    cpeNodeFontColor = (cpeId) => {
        let cpePresent = this.props.activeCpes.filter(ac => ac.id.indexOf(cpeId) !== -1);
        return cpePresent.length ? COLOR_WHITE : COLOR_DARK_GREY;
    }

   
    convertCves= (props) => {
        this.cpeCount = 0;
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = props.allCves || [];
        const userSelectedCpes = getActiveCpesGenericForm(props.activeCpes);
        //let group = -1;
        
        let createdEdges = new Set();
        let createdNodes = new Set();
        // add node for primary cpe:
        let primaryCpeId = CVEs.getCpeAsUriBinding(props.currentCpe);
        this.nodes.add({
            id: primaryCpeId, 
            shape: 'box',
            color: '#00b5ad',
            font: {color: '#ffffff'},
            label: CPEs.vendorProduct(props.currentCpe.id)
        });
        createdNodes.add(primaryCpeId);
        
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
        this.edges.add( {from: 'vulnConfig', to: primaryCpeId} );
        createdEdges.add('vulnConfig' + primaryCpeId);

        // iterate over all CVEs:
        allCves.forEach( (cve) => {
            //console.log("CVE for graph: ");
            //console.log(cve);
            if (!cve.hasOwnProperty('vulnerable_product_stems')) {
                return;
            }

            // Add node for CVE with score:
            //group++;
            this.nodes.add({
                id: cve.id, 
                label: cve.id + '\n' + cve.cvss.toString(), 
                title: cve.id,
                color: CVEs.colorValueForScore(cve.cvss),
                shape: cve.has_exploit ? 'triangle' : 'dot',
                size: 10
            });
            
            let summaryNodes = {};

            
            // add summary nodes with severity count for primary cpe:
             props.cpeSummaries.forEach( (cs) => {
                if (CVEs.getCpeAsUriBinding(cs.cpe) === primaryCpeId) {
                    if ( needToCreateSummaryNode(cs, createdNodes, primaryCpeId, "CRITICAL") ) {
                        summaryNodes.CRITICAL = createSummaryNode(primaryCpeId, "CRITICAL", cs.summary.CRITICAL, COLOR_RED);
                        this.nodes.add(summaryNodes.CRITICAL);
                        this.edges.add( {from: summaryNodes.CRITICAL.id, to: primaryCpeId} );
                        createdNodes.add("CRITICAL" + "_" + primaryCpeId);
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpeId, "HIGH") ) {
                        summaryNodes.HIGH = createSummaryNode(primaryCpeId, "HIGH", cs.summary.HIGH, COLOR_ORANGE);
                        this.nodes.add(summaryNodes.HIGH);
                        this.edges.add( {from: summaryNodes.HIGH.id, to: primaryCpeId} );
                        createdNodes.add("HIGH" + "_" +  primaryCpeId);
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpeId, "MEDIUM") ) {
                        summaryNodes.MEDIUM = createSummaryNode(primaryCpeId, "MEDIUM", cs.summary.MEDIUM, COLOR_AMBER);
                        this.nodes.add(summaryNodes.MEDIUM);
                        this.edges.add( {from: summaryNodes.MEDIUM.id, to: primaryCpeId} );
                        createdNodes.add("MEDIUM" + "_" +  primaryCpeId);
                    }
                    else if ( needToCreateSummaryNode(cs, createdNodes, primaryCpeId, "LOW") ) {
                        summaryNodes.LOW = createSummaryNode(primaryCpeId, "LOW", cs.summary.LOW, COLOR_GREEN);
                        this.nodes.add(summaryNodes.LOW);
                        this.edges.add( {from: summaryNodes.LOW.id, to: primaryCpeId} );
                        createdNodes.add("LOW" + "_" +  primaryCpeId);
                    }
                }
             });

            // add vulnerable product CPEs:
            cve.vulnerable_product_stems.forEach( (vulnerableCpeId) => {
                const cpeGenericId = CVEs.getCpeIdAsUriBinding(vulnerableCpeId);
                //console.log("vend_prod from vulnprod: " + vendor_product);
                if (!createdNodes.has(cpeGenericId)) {
                    this.cpeCount++;
                    if (this.cpeCount > MAX_CPES) {
                        if (!createdNodes.has("maxCpeCountNode")) {
                            let maxCpeNode = renderMaxCpeCountNode();
                            this.nodes.add(maxCpeNode);
                            createdNodes.add("maxCpeCountNode");
                            this.edges.add( {from: maxCpeNode.id, to: "vulnConfig"} );
                            
                        } 
                    }
                    else {
                        this.nodes.add({
                            id: cpeGenericId, 
                            shape: 'box',
                            color: this.cpeNodeColor(cpeGenericId),
                            font: {color: this.cpeNodeFontColor(cpeGenericId)},
                            label: CPEs.vendorProduct(vulnerableCpeId)
                        });
                        createdNodes.add(cpeGenericId);
                        // TODO may need edge creation here
                    }
                }
            });

             // link cve node to summary node with correct criticality:
             let cveTargetNodeId = determineCveTargetNodeId(cve, primaryCpeId);
             if (!createdEdges.has(cve.id + cveTargetNodeId)) {
                 //targetNode = determineTargetNode(summaryNodes, cve);
                 this.edges.add( {from: cve.id, to: cveTargetNodeId} );
                 createdEdges.add(cve.id + cveTargetNodeId);
             }

            // add all CPEs for vulnerable configurations:
            cve.vulnerable_configuration_stems.forEach( (cpeId) => {
                const vendor_product = CPEs.vendorProduct(cpeId);
                const cpeGenericId = CVEs.getCpeIdAsUriBinding(cpeId);
                //console.log("Vend_prod from vulnConf: " +vendor_product);

                if (!createdNodes.has(cpeGenericId)) {
                    this.cpeCount++;
                    if (this.cpeCount > MAX_CPES) {
                        if (!createdNodes.has("maxCpeCountNode")) {
                            let maxCpeNode = renderMaxCpeCountNode();
                            this.nodes.add(maxCpeNode);
                            createdNodes.add("maxCpeCountNode");
                            this.edges.add( {from: maxCpeNode.id, to: "vulnConfig"} );
                        } 
                    }
                    else {       
                        //console.log("adding vulnconf: " + vendor_product);
                        this.nodes.add( {
                            id: cpeGenericId, 
                            shape: 'box',
                            color: this.cpeNodeColor(cpeGenericId),
                            font: {color: this.cpeNodeFontColor(cpeGenericId)}, 
                            label: vendor_product} );
                        createdNodes.add(cpeGenericId);
                    }
                }
                // link them to the vulnconfig node for the primary cpe:
                if (!createdEdges.has('vulnConfig'+cpeGenericId)
                        && !(primaryCpeId===cpeGenericId)) {
                    this.edges.add( {from: 'vulnConfig', to: cpeGenericId} );
                    //console.log("add cpe edge: " + primaryCpeId + "---" + vendor_product);
                    createdEdges.add('vulnConfig' + cpeGenericId);
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
        
        this.network.on("click", (event) => {
            let nodeId = event.nodes[0];
            if (nodeId) {
                if (nodeId.match("^CVE-.+")) {
                    this.onCveNodeSelected(nodeId);
                    //console.log('CVE click event: ' + JSON.stringify(event, null, 4));
                }
                else if (nodeId.match("^cpe:.+")) {
                    if (!this.props.maxCpesReached) {
                        this.nodes.update({
                            id: nodeId,
                            color: COLOR_TEAL,
                            font: {color: COLOR_WHITE}, 
                        });
                        this.onCpeNodeSelected(event.nodes[0]);
                        //console.log('CPE click event: ' + JSON.stringify(event, null, 4));
                    }
                }
            }
        });
        
        this.network.on("stabilizationProgress", function(params) {
            var maxWidth = 496;
            var minWidth = 20;
            var widthFactor = params.iterations/params.total;
            var width = Math.max(minWidth,maxWidth * widthFactor);

            if (!document.getElementById('bar')) {
                return;
            }

            document.getElementById('bar').style.width = width + 'px'
            document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%'
        });
        var component = this;
        this.network.once("stabilizationIterationsDone", function() {
            if (!document.getElementById('text')) {
                return;
            }
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
    }
    
    componentDidMount() {
        this.showPlaceholder();
    }
    
    // update only when allCves changes and all other properties are present as well:
    // FIXME replace old 'willreceiveprops' method with 'willMount'
    UNSAFE_componentWillReceiveProps(nextProps) {
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
            </React.Fragment>
        );
    }
}
