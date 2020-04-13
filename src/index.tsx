import React from 'react';
import ReactDOM from 'react-dom';

import debug from 'debug';

import App from './components/app';
import './index.css';

import * as serviceWorker from './serviceWorker';

const log = debug('app:index');

log('UI render');
ReactDOM.render(<App />, document.getElementById('root'));

log('ServiceWorker');
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
