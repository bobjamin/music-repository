import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import './assets/stylesheets/bootstrap.min.css';
import './assets/stylesheets/index.scss';
import App from './components/app';
import store from "./store";
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
