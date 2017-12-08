import * as React from 'react';
import Navbar from './navbar';
import Login from './login';
import Music from './music';
import { Route } from 'react-router-dom'
import {Redirect, RouteComponentProps, Switch} from "react-router";
import ReactNode = React.ReactNode;
import AddMusic from "./add-music";

const App = () => (
    <div>
        <main>
            <Navbar/>
            <Switch>
                <Route exact path="/" render={(props: RouteComponentProps<any>):ReactNode => ( <Redirect to="/login"/> )} />
                <Route exact path="/login" component={Login}/>
                <Route exact path="/music" component={Music}/>
                <Route exact path="/music/add" component={AddMusic}/>
                <Route render={_404}/>
            </Switch>
        </main>
    </div>
);

export default App;

const _404 = (props: RouteComponentProps<any>):ReactNode => (
    <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px' }}>
        <div className="container">
            <div style={{color:'white', fontWeight:'lighter', textAlign:'center'}}>
                <h1 style={{fontSize:'80px'}}>404</h1>
                <p>This is not the page you were looking for :{'/'}</p>
            </div>
        </div>
    </div>
);