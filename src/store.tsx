import { createStore, applyMiddleware, combineReducers } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import auth from './services/auth-service'
import music from './services/music-service'

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
    thunk,
    routerMiddleware(history)
];

const composedEnhancers = composeWithDevTools(
    applyMiddleware(...middleware),
    ...enhancers
);

const rootReducer = combineReducers({
    routing: routerReducer,
    auth,
    music
});

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

export default store