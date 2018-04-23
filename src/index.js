import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/index';
import registerServiceWorker from './registerServiceWorker';
import './assets/css/app.less';

const container = document.getElementById('root');

ReactDOM.render(<Routes />, container);
registerServiceWorker();