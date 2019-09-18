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

export default class CveGraph extends Component {
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
            //group++;
            this.nodes.add( {id: cve.id, 
                label: cve.cvss.toString(), 
                title: cve.id,
                color: CVEs.colorForScore(cve.cvss) } );
            
            let primaryCpe='';
            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vulnerableCpe.split(":")[2] + " " + vulnerableCpe.split(":")[3];
                if (!primaryCpe && userSelectedCpes.has(vendor_product)) {
                    primaryCpe = vendor_product;
                }
            });

            cve.vulnerable_product.forEach( (vulnerableCpe) => {
                const vendor_product = vulnerableCpe.split(":")[2] + " " + vulnerableCpe.split(":")[3];
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
                if (!createdEdges.has(cve.id+primaryCpe)) {
                    this.edges.add( {from: cve.id, to: primaryCpe} );
                    //console.log("add cve edge: " + cve.id + "---" + vendor_product);
                    createdEdges.add(cve.id + primaryCpe);
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