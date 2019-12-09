import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Client from './Gateways/CpeClient.js'

jest.mock('./Gateways/CpeClient.js');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

