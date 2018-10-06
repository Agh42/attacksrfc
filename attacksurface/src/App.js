import React, { Component } from 'react';
import './App.css';

import CveGraph from './Components/CveGraph';
import EditableInventoryList from './Components/EditableInventoryList';
import CveList from './Components/CveList';
import CpeClient from './Scripts/CpeClient';

import RegisterPage from './Pages/RegisterPage';

export default class App extends Component {
    
    state = {
            selectedCpes: [],
    };
    
    componentDidMount() {
        this.loadSelectedCpes();
    }
    
    loadSelectedCpes = () => {
        let cpes = CpeClient.getSelectedCpes();
        this.setState({ selectedCpes: cpes });
    }
    
    constructor(props) {
        super(props);
        this.registerRef= React.createRef();
    }
    
    handleSaveClick = () => {
          window.scrollTo(0, this.registerRef);
    }
    
    handleDeleteClick = (cpeId) => {
        this.setState({
            selectedCpes: this.state.selectedCpes.filter(c => c.id !== cpeId),
        });
    }
    
  render() {
    return (
        <div className='ui stackable padded grid'>
            <div className='one column row'>
                <div className='sixteen wide column'>
                    <h1 className="ui left aligned header">Vulnerability Manager</h1>
                    <h2 className="ui left aligned header">Instant Vulnerability Management.</h2>
                </div>
            </div>
            <div className='two column row'>
                <div className='five wide column'>
                
                    <EditableInventoryList
                        selectedCpes={this.state.selectedCpes}
                        onSaveClick={this.handleSaveClick}
                        onDeleteClick={this.handleDeleteClick}
                    />
                </div>
                <div className='eleven wide column'>
                    <CveGraph 
                    />
                </div>
            </div>
            
            <div className='one column row'>
                <div className='sixteen wide column'>
                    <CveList 
                    />
                </div>
            </div> 
            
            <div className='one column row'>
                <div className='sixteen wide column'>
                <div ref={this.registerRef} ></div>
                    <RegisterPage 
                    />
                </div>
            </div> 
            
        </div> 
    );
  }
}
