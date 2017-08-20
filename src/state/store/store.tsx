import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import getReducers from '../reducers/reducers';

const middleware = applyMiddleware();

const store = createStore(getReducers(), composeWithDevTools(), middleware);

export default store;
