import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';
//import * as ApiCalls from './Scripts/ApiCalls';
//import 'fomantic-ui/dist/semantic.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
unregister();
