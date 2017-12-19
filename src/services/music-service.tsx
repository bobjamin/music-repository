import Axios from 'axios';
import Artist from "../model/artist";
import {Music} from "../model/music";

const musicUrl = 'https://0p5q8ygv39.execute-api.eu-west-1.amazonaws.com/dev/music';
const groupUrl = 'https://0p5q8ygv39.execute-api.eu-west-1.amazonaws.com/dev/groups';
const artistUrl = 'https://begbh03p5g.execute-api.eu-west-1.amazonaws.com/dev/artists';

export const SEARCH_TEXT_CHANGED = 'music/SEARCH_TEXT_CHANGED';
export const MUSIC_UPDATED = 'music/MUSIC_UPDATED';
export const ARTISTS_FOUND = 'music/ARTISTS_FOUND';
export const THUMBNAIL_UPDATED = 'music/THUMBNAIL_UPDATED';
export const ADDING_MUSIC_FAILED = 'music/ADDING_MUSIC_FAILED';
export const ADDING_MUSIC_SUCCESS = 'music/ADDING_MUSIC_SUCCESS';
export const ADDING_ARTIST_SUCCESS =  'music/ADDING_ARTIST_SUCCESS';
export const NEW_MUSIC_INIT = 'music/NEW_MUSIC_INIT';
export const GROUPS_FOUND = 'music/GROUPS_FOUND';
export const PIECE_SELECTED = 'music/PIECE_SELECTED';

const initialState = {
    searchText: "",
    artists: [],
    music: [],
    thumbnails: new Map<string, string>(),
    addMusicFailReason: null,
    musicAdded: false,
    groups: [],
    selectedIds: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_TEXT_CHANGED:
            return {
                ...state,
                searchText: action.payload
            };
        case ARTISTS_FOUND:
            return {
                ...state,
                artists: action.payload,
                addMusicFailReason: null
            };
        case MUSIC_UPDATED:
            return {
                ...state,
                music: action.payload,
                addMusicFailReason: null
            };
        case THUMBNAIL_UPDATED:
            return {
                ...state,
                thumbnails: action.payload
            };
        case ADDING_MUSIC_FAILED:
            return {
                ...state,
                addMusicFailReason: action.payload
            };
        case ADDING_MUSIC_SUCCESS:
            return {
                ...state,
                musicAdded: true,
                addMusicFailReason: null
            };
        case ADDING_ARTIST_SUCCESS:
            return {
                ...state,
                addMusicFailReason: null
            };
        case NEW_MUSIC_INIT:
            return {
                ...state,
                musicAdded: false,
                addMusicFailReason: null
            };
        case GROUPS_FOUND:
            return {
                ...state,
                groups: action.payload
            };
        case PIECE_SELECTED:
            return {
                ...state,
                selectedIds:action.payload
            };
        case 'auth/SIGNED_OUT':
            return {
                ...state,
                groups: null,
                music: null,
                artists: null
            };
        default: return state;
    }
}

export const searchTextChanged = text => dispatch => dispatch({ type: SEARCH_TEXT_CHANGED, payload: text });

export const retrieveMusic = (idJwtToken) => async dispatch => {
    let artistsResponse = await Axios.request({ method: 'get',  url: artistUrl, headers: { 'Authorization': idJwtToken }});
    let artists = artistsResponse.data.map(Artist.from);
    let artistMap: Map<string, Artist> = artists.reduce((map, artist) => { map.set(artist.uid, artist); return map; }, new Map<string, Artist>());

    dispatch({type: ARTISTS_FOUND, payload: artists.map(Artist.from)});
    let musicResponse = await Axios.request({ method: 'get',  url: musicUrl, headers: { 'Authorization': idJwtToken }});
    let musicList = musicResponse.data.map( (m) => {
        let music = Music.from(m);
        if(artistMap.has(m.artist)){
            music.artist = artistMap.get(m.artist) as any;
        }
        return music;
    });
    dispatch({type: MUSIC_UPDATED, payload: musicList});
    retrieveThumbnails(musicList, idJwtToken)(dispatch);
};

const retrieveThumbnails = (music: Music[], idJwtToken) => async dispatch => {
    let thumbnails = new Map<string, string>();
    for(let i = 0; i < music.length; i++){
        try {
            let thumbnailData = await Axios.request({ method: 'get',  url: musicUrl + '/' + music[i].uid + '/thumbnail', headers: { 'Authorization': idJwtToken }});
            let thumbnail = thumbnailData.data;
            thumbnails.set(music[i].uid, thumbnail);
            dispatch({ type: THUMBNAIL_UPDATED, payload:Array.from(thumbnails).reduce((map, [uid, data]) => {map.set(uid, data); return map;}, new Map<string, string>())});
        }
        catch(e){
            console.warn(e);
        }
    }
};

export const newMusicInit = () => dispatch => dispatch({type: NEW_MUSIC_INIT});

export const createMusic = (genre: string, artist: string, opus: string, number: string, name: string, pdf: string, idJwtToken) => async dispatch => {
    try {
        dispatch({type: NEW_MUSIC_INIT});
        let result = await Axios.post(musicUrl, {
            owner: 'e8a1c2c5-fe85-472e-985c-0c52931f489b',
            artist: artist,
            genre: genre,
            number: +number,
            opus: opus,
            name: name,
            instrument: 'piano',
            pdf: pdf
        }, {headers: {'Authorization': idJwtToken}});
        dispatch({ type: ADDING_MUSIC_SUCCESS });
        retrieveMusic(idJwtToken)(dispatch)
    }
    catch(err){
        dispatch({type: ADDING_MUSIC_FAILED, payload:err.message});
        throw err
    }
};

export const createArtist = (firstName: string, lastName: string, idJwtToken) => async dispatch => {
    try {
        dispatch({type: NEW_MUSIC_INIT});
        let answer = await Axios.post(artistUrl, {
            firstName: firstName,
            lastName: lastName
        }, {headers: {'Authorization': idJwtToken}});
        console.log('artist with uid ' + answer.data + ' created');
        dispatch({ type: ADDING_ARTIST_SUCCESS });
        return answer.data;
    }
    catch(err){
        dispatch({type: ADDING_MUSIC_FAILED, payload:err.message});
        throw err
    }
};

export async function getSheetMusicFor(uid: string, idJwtToken): Promise<string>{
    let data = await Axios.request({ method: 'get',  url: musicUrl + '/' + uid + "/pdf", headers: { 'Authorization': idJwtToken }});
    return data.data;
}

export const groups = (idJwtToken) => async dispatch => {
    let response = await Axios.request({ method: 'get',  url: groupUrl, headers: { 'Authorization': idJwtToken }});
    let groups = response.data;
    console.log(JSON.stringify(groups));
    dispatch({type: GROUPS_FOUND, payload: groups });
};

export const createGroup = (name: string, idJwtToken) => async dispatch => {
    await Axios.post(groupUrl, {name: name}, {headers: {'Authorization': idJwtToken}});
    console.log('Group Created');
    await groups(idJwtToken)(dispatch);
};

export const invite = (gid: string, user: string, idJwtToken) => async dispatch => {
    await Axios.post(groupUrl+ '/' + gid + '/invitation', {uid: user}, {headers: {'Authorization': idJwtToken}});
    console.log('Invitation Sent');
    await groups(idJwtToken)(dispatch);
};

export const acceptInvite = (gid: string, accept: boolean, idJwtToken) => async dispatch => {
    await Axios.post(groupUrl+ '/' + gid + '/invitation', {accept: accept}, {headers: {'Authorization': idJwtToken}});
    console.log('Invitation Sorted - ' + gid + ' ' + accept);
    await groups(idJwtToken)(dispatch);
};


export const removeMember = (gid: string, uid: string, idJwtToken) => async dispatch => {
    await Axios.post(groupUrl+ '/' + gid + '/invitation', {uid: uid, remove: true}, {headers: {'Authorization': idJwtToken}});
    console.log('Invitation Removed');
    await groups(idJwtToken)(dispatch);
};

export const pieceSelected = (pieces: any[]) => dispatch => {
    dispatch( {type:PIECE_SELECTED, payload: pieces} );
};

export const addPiecesToGroup = (gid: string, pieces: Array<{mid: string, groups: Array<string>}>, idJwtToken) => async dispatch => {
    console.log(JSON.stringify(pieces));
    await Axios.post(groupUrl+ '/' + gid + '/music', {pieces: pieces}, {headers: {'Authorization': idJwtToken}});
    await retrieveMusic(idJwtToken)(dispatch);
};