import * as React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux'
import {connect} from "react-redux";
import Artist from "../model/artist";
import {newMusicInit, createMusic, createArtist} from "../services/music-service";
import {Redirect} from "react-router";

class AddMusic extends React.Component<any, any>{

    initialState = {
        redirect: false
    };

    componentDidUpdate() {
        this.initialState.redirect = this.props.musicAdded;
        if (this.initialState.redirect === true) {
            this.props.history.push("/music");
        }
    }

    componentWillUnmount(){
        this.initialState.redirect = false;
    }

    componentWillMount(){
        this.props.newMusicInit()
        this.setState({fileData: ''})
    }

    openFile(event){
        let input = event.target;
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({fileData: reader.result});
        };
        reader.readAsDataURL(input.files[0])
    }

    addMusic(){
        let genre = (document.getElementById('formGroupGenre') as HTMLInputElement).value;
        let artistElement = document.getElementById('formGroupArtist') as HTMLSelectElement;
        let name = (document.getElementById('formGroupName') as HTMLInputElement).value;
        let number = (document.getElementById('formGroupNumber') as HTMLInputElement).value;
        let opus = (document.getElementById('formGroupOpus') as HTMLInputElement).value;
        let pdf = this.state.fileData;
        let idToken = this.props.authorized?this.props.authTokens.getIdToken().getJwtToken(): '';
        if(!artistElement) {
            let artistFirstName = (document.getElementById('formGroupArtistFirstName') as HTMLSelectElement).value;
            let artistLastName = (document.getElementById('formGroupArtistLastName') as HTMLSelectElement).value;
            this.props.createArtist(artistFirstName, artistLastName, idToken)
            .then((artistUid) => {
                this.props.createMusic(genre, artistUid, opus, number, name, pdf, idToken)
            })
        }
        else{
            let artist = artistElement.options[artistElement.selectedIndex].value;
            this.props.createMusic(genre, artist, opus, number, name, pdf, idToken)
        }
    }

    render(){
        if(!this.props.authorized) return (<Redirect to="/login"/>);
        return (
            <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px' }}>
                <div style={{ fontWeight: 'lighter' as 'lighter', borderRadius: '5px', backgroundColor: 'rgb(35, 53, 63)', color: 'rgb(180, 191, 195)', padding: '30px 50px' }} className="container col-4 clearfix">
                    <h1 style={{ textAlign: 'center', fontWeight: 'lighter' as 'lighter', paddingBottom: '20px'}}>Add New Music</h1>
                    <div className="form-group" >
                        <label htmlFor="formGroupGenre">Genre</label>
                        <input id="formGroupGenre" className="form-control" type="text" />
                    </div>
                    <AddArtists artists={this.props.artists} />
                    <div className="form-group" >
                        <label htmlFor="formGroupOpus">Opus</label>
                        <input id="formGroupOpus" className="form-control" type="text" />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="formGroupNumber">Number</label>
                        <input id="formGroupNumber" className="form-control" type="text" />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="formGroupName">Name</label>
                        <input id="formGroupName" className="form-control" type="text" />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="formGroupPdf">Pdf</label>
                        <input id="formGroupPdf" className="form-control" type="file" onChange={ this.openFile.bind(this) }/>
                    </div>
                    <Button style={{ float: 'right' }} className="btn-primary" onClick={ this.addMusic.bind(this) }>Save</Button>
                    <Link to='/music'><Button style={{ float: 'left' }} className="btn-primary">Cancel</Button></Link>
                    <p>{this.props.addErrorString}</p>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, artists: state.music.artists, musicAdded: state.music.musicAdded, addErrorString: state.music.addMusicFailReason }),
    dispatch => bindActionCreators({ newMusicInit, createMusic, createArtist } as any, dispatch)
)(AddMusic)

class AddArtists extends React.Component<{ artists:Map<string, Artist> },{ newArtist: boolean }>{

    componentWillMount(){
        this.setState({newArtist: false});
    }

    artists(){
        return Array.from(this.props.artists).map(([uid, artist]) => (<option key={uid} value={uid}>{artist.firstName + ' ' + artist.lastName}</option>));
    }

    newClicked(){
        this.setState({newArtist: !this.state.newArtist});
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="formGroupArtist">
                    Artist
                    <i onClick={this.newClicked.bind(this)} className="fa fa-plus" style={{ paddingLeft: '10px', cursor: 'pointer' }}/>
                </label>
                {
                    this.state.newArtist ? (
                            <div style={{ paddingLeft: '50px' }}>
                                <div className="form-group">
                                    <label htmlFor="formGroupArtistFirstName">First Name</label>
                                    <input id="formGroupArtistFirstName" className="form-control" type="text"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="formGroupArtistLastName">Last Name</label>
                                    <input id="formGroupArtistLastName" className="form-control" type="text"/>
                                </div>
                            </div>
                        ) : (
                            <select id="formGroupArtist" className="form-control">
                                {this.artists()}
                            </select>
                        )
                }
            </div>
        )
    }
}