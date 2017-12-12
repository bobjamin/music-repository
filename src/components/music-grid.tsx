import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {Redirect} from "react-router";
import { Link } from "react-router-dom";
import {searchTextChanged} from "../services/music-service";
import {Music} from "../model/music";
import Artist from "../model/artist";
import MusicPiece from "./music-piece";

class MusicGrid extends React.Component<{pieceSelected:any}, any>{

    componentWillUpdate(){
    }

    filterWith(filter, musicMap){
        let pieceMatch = (piece) => piece.pieceName().toLowerCase().indexOf(filter) != -1;
        let any = (list, match) => {
            for(let i = 0; i<list.length; i++){ if(match(list[i]))return true; }
            return false;
        };
        return musicMap.filter(([artist, musicList]) => artist.name().toLowerCase().indexOf(filter) != -1 || any(musicList, pieceMatch))
            .map(([artist, musicList]) => [artist, musicList.filter(pieceMatch)])
            .filter(([artist, musicList]) => musicList['length'] > 0)
    }

    filteredMusicList(){
        let filter = this.props['searchText'].toLowerCase();
        let allMusic = this.props['music'];
        if(allMusic) {
            allMusic = allMusic.map( piece => {piece.thumbnail = this.props['thumbnails'].get(piece.uid); return piece;});
            let musicMap = Array.from(allMusic.reduce((map, piece) => {
                if (map.has(piece.artist)) map.get(piece.artist).push(piece); else map.set(piece.artist, [piece]);
                return map;
            }, new Map<Artist, Array<Music>>()));
            if (filter !== '') {
                musicMap = this.filterWith(filter, musicMap)
            }
            musicMap = musicMap
                .map(([artist,musicList]) => [artist, musicList.sort((ma, mb) => ma.pieceName().localeCompare(mb.pieceName()))])
                .sort(([aa,am], [ba, bm]) =>  aa.name().localeCompare(ba.name()));
            return musicMap.map(([artist, musicList]) =>
                <div key={artist.uid + ' section'} className="row">
                    <div key={artist.uid + ' title'} style={{ width: '100%', borderBottom: '1px solid rgb(48, 59, 82)', padding: '10px', paddingTop: '30px', marginLeft: '20px'}}>
                        <h4 style={{ textAlign: 'left' }}>{artist.name()}</h4>
                    </div>
                    { musicList.map(music => <MusicPiece key={music.uid} piece={music} thumbnail={music.thumbnail} thumbnailClicked={() => this.props.pieceSelected(music.uid)}/>) }
                </div>
            );
        }
    }

    render(){
        return <div className="grid row col-12">
            { this.filteredMusicList() }
        </div>
    }
}

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, authTokens: state.auth.authTokens, searchText: state.music.searchText, music: state.music.music, thumbnails: state.music.thumbnails }),
    dispatch => bindActionCreators({ searchTextChanged } as any, dispatch)
)(MusicGrid)