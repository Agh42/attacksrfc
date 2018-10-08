import React, { Component } from 'react';
import * as vis from 'vis';


export default class CveGraph extends Component {
   data;
   nodes;
   edges;
   
    convertCves= (props) => {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = props.selectedCves;
        console.log("convertcpes");
        console.log(props.selectedCves);
        allCves.forEach( (cve) => {
            this.nodes.add( {id: cve.id, label: cve.id} );
            console.log("added cve node: " + cve.id);
            let createdEdges = new Set();
            cve.vulnerable_configuration.forEach( (cpe) => {
                const vendor_product = cpe.split(":")[3] + ":" + cpe.split(":")[4];
                try {
                    this.nodes.add( {id: vendor_product, label: vendor_product} );
                    console.log("added cpe node: " + vendor_product)
                }
                catch(err) {
                    //already present, do nothing
                }
                // link cve to cpe:
                if (!createdEdges.has(cve.id+vendor_product)) {
                    this.edges.add( {from: cve.id, to: vendor_product} );
                    createdEdges.add(cve.id + vendor_product);
                    console.log("add edge: " + cve.id +" to "+vendor_product);
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
        console.log("initgraph");
        console.log(
                props.selectedCves);
        var options = {
                autoResize: true,
                height: '100%',
                width: '100%',
        };
        this.convertCves(props);
        let container = document.getElementById('cvegraph');
        console.log(this.data);
        new vis.Network(container, this.data, options);
    } 
    
    componentDidMount() {
        console.log("didmount");
        console.log(this.props.selectedCves);
        //this.forceUpdateInterval = setInterval( () => this.initGraph(), 50 );
        this.initGraph(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        console.log("willreceiveprops");
        console.log(nextProps);
        this.initGraph(nextProps);
    }
    
//    shouldComponentUpdate(nextProps, nextState) {
//        console.log("shouldupdate");
//        console.log(nextProps);
//        console.log(nextState);
//        return false;
//    }
            
            
    render() {
        console.log("render");
        console.log(this.props.selectedCves);
        return (
            <div className='ui raised segment' style={{"height":"30em"}}>
                <div id="cvegraph" style={{"height":"100%"}}></div>
            </div>
        );
    }
}