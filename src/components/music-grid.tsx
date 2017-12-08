import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {Redirect} from "react-router";
import { Link } from "react-router-dom";
import {searchTextChanged} from "../services/music-service";
import {Music} from "../model/music";
import Artist from "../model/artist";
import MusicPiece from "./music-piece";

const MusicGrid = (props: {pieceSelected: any}) => (
    <div className="grid row col-12">
        { gridItems((props as any).music, (props as any).thumbnails, props.pieceSelected, (props as any).searchText) }
    </div>
);

function filtered(musicList: Music[], artist: Artist, filter: string): Music[]{
    if(filter && filter != ''){
        let lowerFilter = filter.toLowerCase();
        if(artist.name().toLowerCase().indexOf(lowerFilter) != -1) return musicList;
        else return musicList.filter((piece) => piece.pieceName().toLowerCase().indexOf(lowerFilter) != -1);
    }
    return musicList;
}

function gridItems(music: Map<Artist, Music[]>, thumbnails: Map<string, string>, pieceSelected: (uid) => void, searchText: string) {
    let thumbnailFor = (uid:string) => (thumbnails && thumbnails.has(uid)) ? thumbnails.get(uid): null;
    let items = [];
    if(music) {
        let key = 0;
        music.forEach((musicList, artist) => {
            let filteredMusicList = filtered(musicList, artist, searchText);
            if(filteredMusicList.length > 0) items.push(titleElementFor(artist));
            items.push(
                (<div key={artist.uid} className="row">
                    {filteredMusicList.map((music, index) =>
                        <MusicPiece
                            key={music.uid}
                            text={music.pieceName()}
                            thumbnail={thumbnailFor('' + music.uid)}
                            thumbnailClicked={()=>pieceSelected(music.uid)}/>
                    )}
                </div>));
        });
    }
    return items;
}

const titleElementFor = (artist: Artist) => {
    return (
        <div key={artist.uid + 'title'} style={{ width: '100%', borderBottom: '1px solid rgb(48, 59, 82)', padding: '10px', paddingTop: '30px', marginLeft: '20px'}}>
            <h4 style={{ textAlign: 'left' }}>{artist.name()}</h4>
        </div>
    );
};

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, searchText: state.music.searchText, music: state.music.music, thumbnails: state.music.thumbnails }),
    dispatch => bindActionCreators({ searchTextChanged } as any, dispatch)
)(MusicGrid)