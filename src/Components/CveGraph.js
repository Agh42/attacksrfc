import React, { Component } from 'react';
import * as vis from 'vis';

function colorForScore(score) {
    if (score < 5.01) return "#11A100";
    if (score > 8.99) return "#db0000";
    return "#ffa200";
}

export default class CveGraph extends Component {
   data;
   nodes;
   edges;
   
    convertCves= (props) => {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = props.selectedCves;
        //let group = -1;
        
        let createdEdges = new Set();
        let createdNodes = new Set();
        allCves.forEach( (cve) => {
            //group++;
            this.nodes.add( {id: cve.id, 
                label: cve.cvss.toString(), 
                title: cve.id,
                color: colorForScore(cve.cvss) } );
            
            let primaryCpeWas = undefined;
            cve.vulnerable_configuration.forEach( (cpe) => {
                const vendor_product = cpe.split(":")[3] + " " + cpe.split(":")[4];
                
                // update with active color if this is a primary cpe 
                // which already exists as inactive one:
                if (!primaryCpeWas && createdNodes.has(vendor_product)) {
                    this.nodes.update( {id: vendor_product, 
                        shape: 'box',
                        color: '#00b5ad',
                        font: {color: '#ffffff'},
                        label: vendor_product} );
                }
                
                if (!createdNodes.has(vendor_product)) {
                    let color;
                    !primaryCpeWas ?  color = '#00b5ad' :  color = '#c0c0c0';
                    this.nodes.add( {id: vendor_product, 
                        shape: 'box',
                        color: color,
                        font: {color: '#ffffff'},
                        label: vendor_product} );
                    createdNodes.add(vendor_product);
                }
                
                // link only primary cpe to cve:
                if (!primaryCpeWas) {
                    primaryCpeWas=vendor_product;
                    if (!createdEdges.has(cve.id+vendor_product)) {
                        this.edges.add( {from: cve.id, to: vendor_product} );
                        createdEdges.add(cve.id + vendor_product);
                    }
                } else {
                    // link all other cpes to primary cpe (but not to itself):
                    if (!createdEdges.has(primaryCpeWas+vendor_product)
                            && !(primaryCpeWas===vendor_product)) {
                        this.edges.add( {from: primaryCpeWas, to: vendor_product} );
                        createdEdges.add(primaryCpeWas + vendor_product);
                    }
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
                nodes: {borderwidth: 2, shadow: true},
                edges: {width: 2, 
                    shadow: true},
                interaction: {hover: false},
        };
        
        this.convertCves(props);
        let container = document.getElementById('cvegraph');
        new vis.Network(container, this.data, options);
    } 
    
    componentDidMount() {
        this.initGraph(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        console.log("will receive props: ");
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