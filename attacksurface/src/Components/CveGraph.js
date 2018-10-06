import React, { Component } from 'react';
import * as vis from 'vis';
import CpeClient from "../Scripts/CpeClient";



export default class CveGraph extends Component {
   data;
   nodes;
   edges;
    
    convertCves= () => {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        const allCves = CpeClient.getSelectedCves();
        allCves.forEach( (cve) => {
            this.nodes.add( {id: cve.id, label: cve.id} );
            console.log("added cve node: " + cve.id);
            cve.vulnerable_configuration.forEach( (cpe) => {
                const vendor = cpe.split(":")[3];
                const product = cpe.split(":")[4];
                try {
                    this.nodes.add( {id: vendor+":"+product, label: vendor+":"+product} );
                    console.log("added cpe node: " + vendor+":"+product)
                }
                catch(err) {
                    //already present, do nothing
                }
                // link cve to cpe:
                this.edges.add( {from: cve.id, to: vendor+":"+product} );
                console.log("add edge: " + cve.id +" to "+vendor+":"+product);
            });
        });
        //provide the data in the vis format
        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };
        
    }
    
    initGraph= () => {
        var options = {
                autoResize: true,
                height: '100%',
                width: '100%',
        };
        this.convertCves();
        let container = document.getElementById('cvegraph');
        console.log(this.data);
        new vis.Network(container, this.data, options);
    } 
    
    componentDidMount() {
        //this.forceUpdateInterval = setInterval( () => this.initGraph(), 50 );
        this.initGraph();
    }
    
    
            
            
    render() {
        return (
            <div className='ui raised segment' style={{"height":"30em"}}>
                <div id="cvegraph" style={{"height":"100%"}}></div>
            </div>
        );
    }
}