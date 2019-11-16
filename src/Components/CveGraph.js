import React, { Component } from 'react';
import * as vis from 'vis';
import CVEs from '../Dto/CVEs';



function getCpesGenericForm(cpes) {
    let result = new Set();
    cpes.forEach( (cpe) => {
        if (cpe.isActive) {
            const vendor_product = cpe.id.split(":")[3] + " " + cpe.id.split(":")[4];
            result.add(vendor_product);
        }
    });
    return result;
}

function vendorProduct(cpe) {
    return cpe.split(":")[2] + " " + cpe.split(":")[3]
}

function getResultsCount(allCves) {
    allCves.
}

export default class CveGraph extends Component {

 static propTypes = {
        allCves: PropTypes.object.isRequired,
        totalCveCount: PropTypes.number.isRequired,
        activeCpes: PropTypes.object.isRequired,
        cpeSummaries: PropTypes.object.isRequired
    };


   data;
   nodes;
   edges;
   
    convertCves= (props) => {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = props.selectedCves;
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
                color: CVEs.colorForScore(cve.cvss) } );
            
            let primaryCpe='';
            let summaryNodes = {};

            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vendorProduct(vulnerableCpe);
                if (!primaryCpe && userSelectedCpes.has(vendor_product)) {
                    primaryCpe = vendor_product;
                }
            });
            
            // add summary nodes with severity count:
             cpeSummaries.forEach( (cs) => {
                if (vendorProduct(cs.cpe.id) === primaryCpe) {
                    if ( this.checkSummaryNodePresent(createdNodes, "CRITICAL") ) {
                        summaryNodes.CRITICAL = createSummaryNode("CRITICAL", cs.summary.CRITICAL, CVEs.COLOR_RED);
                        this.nodes.add(summaryNodes.CRITICAL);
                        createdNodes.add(summaryNodes.CRITICAL);
                    }
                    else if ( this.checkSummaryNodePresent(createdNodes, "HIGH") ) {
                        summaryNodes.HIGH = createSummaryNode("HIGH", cs.summary.HIGH, CVEs.COLOR_RED);
                        this.nodes.add(summaryNodes.HIGH);
                        createdNodes.add(summaryNodes.HIGH);
                    }
                    else if ( this.checkSummaryNodePresent(createdNodes, "MEDIUM") ) {
                        summaryNodes.MEDIUM = createSummaryNode("MEDIUM", cs.summary.MEDIUM, CVEs.COLOR_AMBER);
                        this.nodes.add(summaryNodes.MEDIUM);
                        createdNodes.add(summaryNodes.MEDIUM);
                    }
                    else if ( this.checkSummaryNodePresent(createdNodes, "LOW") ) {
                        summaryNodes.LOW = createSummaryNode("LOW", cs.summary.LOW, CVEs.COLOR_GREEN);
                        this.nodes.add(summaryNodes.LOW);
                        createdNodes.add(summaryNodes.LOW);
                    }
                    
                }
             });

            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vendorProduct(vulnerableCpe);
                //console.log("vend_prod from vulnprod: " + vendor_product);
                if (!createdNodes.has(vendor_product)) {
                    let color = (primaryCpe === vendor_product) ? '#00b5ad' : '#c0c0c0';
                    
                    this.nodes.add( {id: vendor_product, 
                        shape: 'box',
                        color: color,
                        font: {color: '#ffffff'},
                        label: vendor_product} );
                    createdNodes.add(vendor_product);
                }
                cveTargetNodeId = determineCveTargetNodeId(cve, primaryCpe);
                if (!createdEdges.has(cve.id+cveTargetNodeId)) {
                    targetNode = determineTargetNode(summaryNodes, cve);
                    this.edges.add( {from: cve.id, to: cveTargetNodeId} );
                    createdEdges.add(cve.id + cveTargetNodeId);
                }
            });

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
                
                if (!createdEdges.has(primaryCpe+vendor_product)
                        && !(primaryCpe===vendor_product)) {
                    this.edges.add( {from: primaryCpe, to: vendor_product} );
                    console.log("add cpe edge: " + primaryCpe + "---" + vendor_product);
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
        console.log("graph will receive props: ");
        console.log(nextProps);
        this.initGraph(nextProps);
    }

    checkSummaryNodePresent(createdNodes, severity) {
        return !createdNodes.has(primaryCpe+"_"+severity)
                        &&  'summary' in cs
                        && severity in cs.summary
    }
    createSummaryNode(severity, count, color) {
        node = {
            id: vendorProduct+"_"+severity, 
            label: count, 
            title: "Found " + label + " critical CVEs. (Only the top 100 CVEs are shown individually.)",
            color: color 
        };
        return node;
    }

    determineCveTargetNodeId(cve) {

    }

    determineTargetNode(summaryNodes, cve) {
        
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