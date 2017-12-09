import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'


class Profile extends React.Component<any,any>{

    render(){
        return (
            <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px'}}>
                <div style={{ borderRadius: '5px', backgroundColor: 'rgb(35, 53, 63)', color: 'rgb(180, 191, 195)', padding: '30px' }} className="container col-lg-4 col-sm-9 clearfix">
                    <div style={{textAlign: 'center'}}>PROFILE FOR {this.props.user.toUpperCase()}</div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, user: state.auth.user }),
    dispatch => bindActionCreators({  } as any, dispatch)
)(Profile)