import React, { Component } from 'react';
import * as vis from 'vis';



//create an array with nodes
let nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

// create an array with edges
let edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

//provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
        autoResize: true,
        height: '100%',
        width: '100%',
};

export default class CveGraph extends Component {
    
    initGraph() {
        var container = document.getElementById('cvegraph');
        new vis.Network(container, data, options);
    } 
    
    componentDidMount() {
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