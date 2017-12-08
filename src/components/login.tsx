import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import { authenticate } from "../services/auth-service";

class Login extends React.Component<any,any>{
    initialState = {
        redirect: false
    };

    componentDidUpdate(){
        this.initialState.redirect = this.props.authorized;
        if(this.initialState.redirect === true){
            console.log(JSON.stringify(this.props));
            this.props.history.push("/music");
        }
    }

    componentWillUnmount(){
        this.initialState.redirect = false;
    }

    componentWillMount(){
        this.setState({register: false, errorString: "", login: false});
    }

    buttonText(){
        return this.state.register ? "REGISTER": "LOGIN"
    }

    setRegister(){
        this.setState({register: true})
    }
    setLogin(){
        this.setState({register: false})
    }

    loginRegisterButtonClicked(){
        let username = (document.getElementById('formGroupUsername') as HTMLInputElement).value;
        let password = (document.getElementById('formGroupPassword') as HTMLInputElement).value;
        this.setState({errorString:""});
        if(this.state.register){
            //this.registerUser(username, password)
        }
        else{
            this.props.authenticate(username, password);
            // authenticateUser(username, password)
            //     .then((result) => {
            //         console.log("Logged in as " + username);
            //         console.log('token = ' + result.getIdToken().getJwtToken());
            //         document.cookie = 'accessToken='+ result.getAccessToken().getJwtToken() +';path=/;expires='+result.getAccessToken().getExpiration()+';';
            //         document.cookie = 'idToken='+ result.getIdToken().getJwtToken() +';path=/;expires='+result.getIdToken().getExpiration()+';';
            //         this.setState({register: false, login: true});
            //         store.dispatch(Actions.AUTH_SUCCESS(result));
            //     }, (error) => {
            //         console.error(error);
            //         this.setState({errorString:error.message})
            //     })
        }
    }


    render(){
        if(this.props.authorized){
            return <div style={{color: 'white'}}>YOU ARE LOGGED IN ALREADY!</div>
        }
        let errorSection;
        if (this.props.errorString) {
            errorSection = (<p style={{paddingTop: '10px', color: '#de5555'}}>{this.props.errorString}</p>);
        }
        else errorSection = (<div/>);
        let registerSection;
        if (!this.state.register)
            registerSection = (
                <div style={{textAlign: 'center'}}>
                    <h4 onClick={() => this.setRegister()}>REGISTER</h4>
                </div>
            );
        else registerSection = (
            <div>
                <div className="form-group">
                    <label htmlFor="formGroupEmail">EMAIL</label>
                    <input id="formGroupEmail" className="form-control" type="email"/>
                </div>
                <div style={{textAlign: 'center'}}>
                    <h4 onClick={() => this.setLogin()}>LOGIN</h4>
                </div>
            </div>
        );
        return (
            <div>
                <div id="all-content-wrapper">
                    <div id="page-content-wrapper" style={pageWrapperStyle}>
                        <div style={containerStyle} className="container col-lg-4 col-sm-9 clearfix">
                            <div style={{textAlign: 'center'}}>
                                <h2 style={h2Style} onClick={()=>this.setLogin()}>LOGIN</h2>
                                <h2 style={{...h2Style, padding: '0px 5px'}}>|</h2>
                                <h2 style={h2Style} onClick={()=>this.setRegister()}>REGISTER</h2>
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroupUsername">USERNAME</label>
                                <input id="formGroupUsername" className="form-control" type="text"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroupPassword">PASSWORD</label>
                                <input id="formGroupPassword" className="form-control" type="password"/>
                            </div>
                            {registerSection}
                            <div style={{textAlign: 'center'}}>
                                <input type="button" value={this.buttonText.bind(this)()}
                                       onClick={()=>this.loginRegisterButtonClicked()} className={this.props.loggingIn?"btn-warning":"btn-primary"}
                                       style={buttonStyle}/>
                                {errorSection}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    authenticate
} as any, dispatch);

const mapStateToProps = state => {
    return ({
        authorized: state.auth.authorized,
        loggingIn: state.auth.loggingIn,
        errorString: state.auth.authFailReason
    });
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)


const h2Style = { fontWeight: 'lighter' as 'lighter', display: 'inline-block' };
const containerStyle = {
    borderRadius: '5px',
    backgroundColor: 'rgb(35, 53, 63)',
    color: 'rgb(180, 191, 195)',
    padding: '30px'
};

const pageWrapperStyle = {
    width: '100%',
    paddingTop: '50px'
};

const buttonStyle = {
    borderRadius: '5px',
    padding: '10px 20px'
};