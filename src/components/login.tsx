import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {authenticate, register} from "../services/auth-service";
import { Button } from 'react-bootstrap';


class Login extends React.Component<any,any>{
    initialState = {
        redirect: false
    };

    componentDidUpdate(){
        this.initialState.redirect = this.props.authorized;
        if(this.initialState.redirect === true){
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
            let email = (document.getElementById('formGroupEmail') as HTMLInputElement).value;
            this.props.register(username, password, email);
        }
        else{
            this.props.authenticate(username, password);
        }
    }


    render() {
        if (this.props.authorized) {
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
                        <Button className={this.props.loggingIn?"btn-warning":"btn-primary"} onClick={()=>this.loginRegisterButtonClicked()}>{this.buttonText.bind(this)()}</Button>
                        {errorSection}
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    authenticate, register
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