import * as React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {Redirect} from "react-router";
import { Link } from "react-router-dom";
import {searchTextChanged, addPiecesToGroup} from "../services/music-service";
import {Music} from "../model/music";
import Artist from "../model/artist";
import MusicPiece from "./music-piece";

class MusicGrid extends React.Component<{pieceSelected:any}, any>{

    componentWillMount(){
        this.setState({pieces: new Map<string, boolean>()})
    }

    isSelected(uid: string){
        let selected = false;
        if(this.state.pieces.has(uid)) selected = this.state.pieces.get(uid);
         return selected;
    }

    anySelected(){
        let s = false;
        this.state.pieces.forEach((selected) => {if(selected)s = true});
        return s;
    }

    setSelected(uid: string, selected: boolean){
        this.state.pieces.set(uid, selected);
        let newMap = new Map<string, boolean>();
        this.state.pieces.forEach((value, key) => {console.log(key + ' -> ' + value);newMap.set(key, value)});
        this.setState({pieces: newMap});
    }

    groupsInSelection(){
        if(this.props['music']) {
            let groupSet = new Map<string, number>();
            let selectedPieces = this.props['music'].filter((music) => this.isSelected.bind(this)(music.uid));
            selectedPieces.filter(piece => piece.groups).forEach(piece => piece.groups.forEach(group => {
                if (!groupSet.has(group)) groupSet.set(group, 1);
                else groupSet.set(group, groupSet.get(group) + 1);
            }));
            return Array.from(groupSet).filter(([gid, count]) => count === selectedPieces.length).map(([gid, count]) => gid)
        }
        return [];
    }

    selectionChanged(uid: string, selected: boolean){
        this.setSelected(uid, selected);
    }

    groupSelected(gid: string, selected: boolean){
        let addGroup = (group, list) => {
            if (list) {
                list.push(group);
                return list;
            }
            return [group];
        };
        let removeGroup = (group, list) => list?list.filter(g => group !== g): [];
        if(this.props['music']) {
            let piecesToUpdate = this.props['music'].filter( music => {
                let hasGroupAlready = music.groups? music.groups.filter(g => g === gid).length > 0: false;
                return this.isSelected.bind(this)(music.uid) && ((!selected && hasGroupAlready) || (selected && !hasGroupAlready))
            });
            let groupInfo;
            if(selected) groupInfo = piecesToUpdate.map(music => { return {mid:music.uid, groups: addGroup(gid, music.groups)} });
            else groupInfo = piecesToUpdate.map(music => { return {mid:music.uid, groups: removeGroup(gid, music.groups)} });
            this.props['addPiecesToGroup'](gid, groupInfo,this.props['authTokens'].getIdToken().getJwtToken());
        }
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
                    { musicList.map(music => <div key={music.uid + 'outer'} className="col-md-3 col-xs-6">
                        <MusicPiece      key={music.uid}
                                         piece={music}
                                         canSelect={music.owner === this.props['user']}
                                         thumbnail={music.thumbnail}
                                         thumbnailClicked={() => this.props.pieceSelected(music.uid)}
                                         selectionChanged={this.selectionChanged.bind(this)}/>
                        </div>) }
                </div>
            );
        }
    }

    groupSection(){
        let groupsInSelection = this.groupsInSelection();
        let inSelection = (gid) => groupsInSelection.filter(g => g === gid).length > 0;
        let groupLi = (group) => {
            if(!group.invitationPending) {
                let gid = group['actualGid'] ? group['actualGid'] : group.gid;
                let isIn = inSelection(gid);
                return (
                    <li key={gid} onClick={()=>this.groupSelected.bind(this)(gid, !isIn)}
                        className={(isIn?"":"un") + "selectedGroup"} style={{}}>{group.name}</li>
                );
            }
            return <div/>
        };
        if(this.props['groupList'].ownedGroups.length > 0 || this.props['groupList'].joinedGroups.length > 0) {
            return (
                <nav className="sidebar">
                    <h2>Groups</h2>
                    <ul>
                        {this.props['groupList'].ownedGroups.map(groupLi)}
                        {this.props['groupList'].joinedGroups.map(groupLi)}
                    </ul>
                </nav>
            )
        }
        return <div/>;

    }

    render(){
        return <div className="grid row col-12">
                    { this.props['groupList'] && this.anySelected()? this.groupSection() : <div/> }
                    { this.filteredMusicList() }
               </div>
    }
}

export default connect(
    (state: any) => ({ authorized: state.auth.authorized, user:state.auth.user, authTokens: state.auth.authTokens, searchText: state.music.searchText, music: state.music.music, thumbnails: state.music.thumbnails, groupList: state.music.groups }),
    dispatch => bindActionCreators({ searchTextChanged, addPiecesToGroup } as any, dispatch)
)(MusicGrid)