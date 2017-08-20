import * as React from 'react';
import { connect } from 'react-redux';
import {Searchbar} from "../searchbar/searchbar";
import {Navbar} from "../navbar/navbar";
import {Grid} from "../grid/grid";
import {retrieveMusic} from "../../services/music-service";
import {Music} from "../../model/music";
import Artist from "../../model/artist";
import {match} from "react-router";
import store from "../../state/store/store";
import {SearchableGrid} from "../searchable-grid/searchable-grid";

class RootContainer extends React.Component<any,any>{

    componentWillMount(){
        this.setState({musicState: {music: new Map<Artist, Music[]>()}});
        retrieveMusic();
    }

    render(){return(
        <div>
            <div id="all-content-wrapper">
                <Navbar />
                <div id="page-content-wrapper" style={pageWrapperStyle}>
                    <SearchableGrid music={this.props.musicState.music}/>
                </div>
            </div>
        </div>
      );
    }
}
export default connect((store) => {
  return {
    musicState: store.musicState
  };})(RootContainer);


const pageWrapperStyle = {
    width: '100%',
    paddingTop: '50px'
};