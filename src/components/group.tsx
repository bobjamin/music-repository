import * as React from 'react';
import { Button } from 'react-bootstrap';
import ClickableText from './clickable-text';

export default class Group extends React.Component<any, any>{

    componentWillMount(){this.setState({inviteOpen: false});}

    inviteClicked(){
        this.setState({inviteOpen: !this.state.inviteOpen});
    }

    sendInvite(user: string){
        this.props.sendInvite(this.props.group.gid, user);
    }

    acceptInvite(accept: boolean){
        this.props.acceptInvite(this.props.group.gid, accept);
    }

    removeMember(user: string, gid: string){
        console.log('gid ' + gid + ' user ' + user);
        this.props.removeMember(gid, user);
    }

    inviteSection(){
        return this.state.inviteOpen ? <ClickableText onClick={this.sendInvite.bind(this)} buttonText="Send Invite" /> : <div/>
    }

    otherMembers(name: string, others:{gid: string, uid: string,invitationPending:boolean}[]){
        return (
            <div>
                <p>{others.length > 0 ? 'Members' : 'No Members'}</p>
                {others.length > 0 ? others.map(other => (
                        <div key={'div ' + name + ' '+ other.uid}>
                            <p key={name + ' '+ other.uid} style={{display: 'inline-block'}}>{other.uid + (other.invitationPending?'(pending)':'')}</p>
                            <i onClick={()=>this.removeMember.bind(this)(other.uid, other.gid)} key={'remove ' + name + ' '+ other.uid} title='Remove Member' className='fa fa-minus deleteIcon' style={{ paddingLeft: '10px', cursor: 'pointer' }}/>
                        </div>
                    ))
                    : <div/>
                }
            </div>
        )
    }


    render(){
        if(this.props.owned){
            return (
                <div style={{ backgroundColor: 'rgb(46, 65, 76)', padding: '10px', paddingBottom: '1px',  borderRadius: '2px', marginBottom: '5px' }}>
                    <Button className="btn-link" style={{float: 'right'}} onClick={this.inviteClicked.bind(this)}>Invite</Button>
                    <p style={{fontSize: '25px', marginBottom: '1px'}}>{this.props.group.name}</p>
                    {this.inviteSection()}
                    {this.otherMembers(this.props.group.name, this.props.group.others)}
                </div>
            )
        }
        else{
            return (
                <div style={{ backgroundColor: 'rgb(46, 65, 76)', padding: '10px', paddingBottom: '1px',  borderRadius: '2px', marginBottom: '5px' }}>
                    {
                        this.props.group.invitationPending ? (
                                <div>
                                    <Button className="btn-danger" style={{float: 'right'}}
                                            onClick={() => this.acceptInvite.bind(this)(false)}>Decline</Button>
                                    <Button className="btn-success" style={{float: 'right', marginRight: '10px'}}
                                            onClick={() => this.acceptInvite.bind(this)(true)}>Accept</Button>
                                </div>
                            )
                            :<div/>
                    }
                    <p style={{fontSize: '25px', marginBottom: '0px'}}>{this.props.group.name}</p><p>{this.props.group.owner}</p>
                </div>
            )
        }
    }
}