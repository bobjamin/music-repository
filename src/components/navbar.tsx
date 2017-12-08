import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Redirect} from "react-router";
let hexagonLogo = require('../assets/images/hexagon-logo.png');

const Navbar = (props) => (
    <div>
        <nav className="navbar navbar-fixed-top" id="navbar-wrapper" role="navigation" style={style}>
            <img src={hexagonLogo} style={logoStyle}/>
            <Link to="/music">
                <div style={titleStyle}>MUSIC REPOSITORY</div>
            </Link>
            <Link to="/login">
                <div style={userStyle}>
                    <i className="fa fa-user-circle" style={userIconStyle}/>
                    <div style={userText}>{props.authorized?props.user: 'LOG IN'}</div>
                </div>
            </Link>
        </nav>
    </div>
);

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, user: state.auth.user }),
    dispatch => bindActionCreators({  } as any, dispatch)
)(Navbar)


const logoStyle = {
    position: 'fixed' as 'fixed',
    zIndex: 200,
    top: '-3px',
    width: '70px',
    marginLeft: '15px'
};

const style = {
    height: '60px',
    width: '100%',
    backgroundColor: 'rgb(35, 53, 63)'
};

const titleStyle = {
    marginLeft: '100px',
    fontSize: '20px',
    fontWeight: 'lighter' as 'lighter',
    color: 'rgb(180, 191, 195)',
};

const userIconStyle = {
    float: 'left' as 'left',
    paddingTop: '6px'
};

const userStyle = {
    float: 'right' as 'right',
    color: 'rgb(180, 191, 195)',
    fontWeight: 'lighter' as 'lighter',
    fontSize: '20px',
    paddingRight: '30px'
};

const userText = {
    paddingLeft: '10px',
    float: 'right' as 'right'
};