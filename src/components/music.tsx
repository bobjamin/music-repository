import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {Redirect} from "react-router";
import { Link } from "react-router-dom";
import Searchbar from './searchbar';
import {searchTextChanged, retrieveMusic, getSheetMusicFor} from "../services/music-service";
import MusicGrid from './music-grid';


class Music extends React.Component<any,any>{

    componentWillMount(){
        if(this.props.authorized) {
            this.props.retrieveMusic(this.props.authTokens.getIdToken().getJwtToken());
        }
    }

    pieceSelected(uid: string){
        if(this.props.authorized){
            let windowReference = window.open();
            getSheetMusicFor(uid, this.props.authTokens.getIdToken().getJwtToken())
            .then((sheetMusic) => {
                windowReference.location.href = sheetMusic;
            })
        }
    }

    render() {
        if(!this.props.authorized) return (<Redirect to="/login"/>);
        return (
            <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px' }}>
                <div className="container">
                    <div className="row search-bar-row">
                        <Searchbar initialText={this.props.searchText} searchTextChanged={this.props.searchTextChanged}/>
                        <Link to='/music/add'>
                            <i className="fa fa-plus" style={{ paddingLeft: '10px', paddingTop: '14px', fontSize: '25px', color: 'rgb(180, 191, 195)', float: 'right'}}/>
                        </Link>
                    </div>
                    <div className="row content-row">
                        <MusicGrid pieceSelected={this.pieceSelected.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, searchText: state.music.searchText }),
    dispatch => bindActionCreators({ searchTextChanged, retrieveMusic } as any, dispatch)
)(Music)