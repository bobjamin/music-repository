import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {Redirect} from "react-router";
import {Button} from 'react-bootstrap';
import {signOut, checkSession} from '../services/auth-service';
import {groups, createGroup, invite, acceptInvite, removeMember} from "../services/music-service";
import Group from "./group";
import ClickableText from "./clickable-text";


class Profile extends React.Component<any,any>{

    componentWillMount(){
        this.props.checkSession();
        if(this.props.authorized){
            this.props.groups(this.props.authTokens.getIdToken().getJwtToken())
        }
        this.setState({newGroup: false});
    }

    createGroupClicked(name: string){
        this.props.createGroup(name, this.props.authTokens.getIdToken().getJwtToken()).then(() => this.setState({newGroup: false}));
    }

    addGroupClicked(){
        this.setState({newGroup: !this.state.newGroup});
    }

    sendInvite(gid: string, user: string){
        this.props.invite(gid, user, this.props.authTokens.getIdToken().getJwtToken());
    }

    acceptInvite(gid: string, accept: boolean){
        this.props.acceptInvite(gid, accept, this.props.authTokens.getIdToken().getJwtToken())
    }

    removeMember(gid: string, uid: string){
        this.props.removeMember(gid, uid, this.props.authTokens.getIdToken().getJwtToken());
    }

    ownedGroupsSection(){
        if(!this.props.groupList || !this.props.groupList.ownedGroups || this.props.groupList.ownedGroups.length == 0)
            return (<p>You do not own any groups yet.</p>);
        else return this.props.groupList.ownedGroups.map((group) => (<Group group={group}
                                                                            owned={true}
                                                                            key={group.gid}
                                                                            removeMember={this.removeMember.bind(this)}
                                                                            sendInvite={this.sendInvite.bind(this)}/>));
    }

    joinedGroupsSection(){
        if(!this.props.groupList || !this.props.groupList.joinedGroups || this.props.groupList.joinedGroups.length == 0)
            return (<p>You have not been invited to any groups yet.</p>);
        else return this.props.groupList.joinedGroups.map((group) => (<Group group={group}
                                                                             owned={false}
                                                                             key={group.gid}
                                                                             acceptInvite={this.acceptInvite.bind(this)}
                                                                        />));
    }

    newGroupSection(){
        return this.state.newGroup ? <ClickableText onClick={this.createGroupClicked.bind(this)} buttonText="Create Group" />: <div/>;
    }


    render(){
        if(!this.props.authorized) return (<Redirect to={{pathname:"/login", state:{redirectedFrom: '/profile'}}}/>);
        return (
            <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px'}}>
                <div style={{ borderRadius: '5px', backgroundColor: 'rgb(35, 53, 63)', color: 'rgb(180, 191, 195)', padding: '30px' }} className="container col-lg-4 col-sm-9 clearfix">
                    <Button style={{float: 'right', marginTop: '5px'}} className="btn-outline-warning" onClick={()=>this.props.signOut()}>Log Out</Button>
                    <div style={{textAlign: 'center'}}>
                        <i className="fa fa-user-circle" style={{fontSize: '30px', paddingTop: '8px', paddingRight: '10px', display: 'inline-block' }}/>
                        <h1 style={{display: 'inline-block'}}>{this.props.user}</h1>
                    </div>
                    <h2 style={{display: 'inline-block'}}>Your Groups</h2>
                    <i onClick={this.addGroupClicked.bind(this)} className="fa fa-plus" style={{ paddingLeft: '10px', fontSize: '25px', cursor: 'pointer' }}/>
                    {this.newGroupSection()}
                    {this.ownedGroupsSection()}
                    <h2 style={{display: 'inline-block'}}>Other Groups</h2>
                    {this.joinedGroupsSection()}
                </div>
            </div>
        )
    }
}

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, user: state.auth.user, groupList: state.music.groups }),
    dispatch => bindActionCreators({ signOut, checkSession, groups, createGroup, invite, acceptInvite, removeMember } as any, dispatch)
)(Profile)