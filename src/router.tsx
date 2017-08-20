import * as React from 'react';
import {Router, Route, RouteComponentProps, Redirect} from 'react-router';
import { createBrowserHistory } from 'history';
import ReactNode = React.ReactNode;
import {connect} from "react-redux";
import RootContainer from './components/containers/root-container'


class RouterComponent extends React.Component<any,{}>{

    render(){
        return (
            <Router history={createBrowserHistory()}>
                <div>
                    <Route exact path="/" component={RootContainer} />
                </div>
            </Router>
        );
    }
}
export default connect((store) => {
    return {

    };})(RouterComponent);