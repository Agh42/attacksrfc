import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Client from './Scripts/CpeClient.js'

jest.mock('./Scripts/CpeClient.js');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

