import Axios from 'axios';
import Artist from "../model/artist";
import {Music} from "../model/music";

const musicUrl = 'https://0p5q8ygv39.execute-api.eu-west-1.amazonaws.com/dev/music';
const artistUrl = 'https://begbh03p5g.execute-api.eu-west-1.amazonaws.com/dev/artists';

export const SEARCH_TEXT_CHANGED = 'music/SEARCH_TEXT_CHANGED';
export const MUSIC_UPDATED = 'music/MUSIC_UPDATED';
export const ARTISTS_FOUND = 'music/ARTISTS_FOUND';
export const THUMBNAIL_UPDATED = 'music/THUMBNAIL_UPDATED';
export const ADDING_MUSIC_FAILED = 'music/ADDING_MUSIC_FAILED';
export const ADDING_MUSIC_SUCCESS = 'music/ADDING_MUSIC_SUCCESS';
export const ADDING_ARTIST_SUCCESS =  'music/ADDING_ARTIST_SUCCESS';
export const NEW_MUSIC_INIT = 'music/NEW_MUSIC_INIT';

const initialState = {
    searchText: "",
    artists: new Map<string, Artist>(),
    music: new Map<Artist, Music[]>(),
    thumbnails: new Map<string, string>(),
    addMusicFailReason: null,
    musicAdded: false
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
        default: return state;
    }
}

export const searchTextChanged = text => dispatch => dispatch({ type: SEARCH_TEXT_CHANGED, payload: text });

export const retrieveMusic = (idJwtToken) => async dispatch => {
    let artistsResponse = await Axios.request({ method: 'get',  url: artistUrl, headers: { 'Authorization': idJwtToken }});
    let artists = artistsResponse.data;
    let musicResponse = await Axios.request({ method: 'get',  url: musicUrl, headers: { 'Authorization': idJwtToken }});
    let music = musicResponse.data;
    let otherArtist = new Artist(-1, "", "Other");
    let artistMap = new Map<string, Artist>();
    artists.forEach(artist => {
        artistMap.set(artist['uid'] + '', Artist.from(artist));
    });
    dispatch({ type: ARTISTS_FOUND, payload: artistMap });
    let musicMap = new Map<Artist, Music[]>();
    music.forEach(music => {
        let artist = artistMap.get(music['artist']);
        if(artist == null){
            artist = otherArtist
        }
        if(!musicMap.has(artist)){
            musicMap.set(artist, []);
        }
        musicMap.get(artist).push(Music.from(music));
    });
    dispatch({ type: MUSIC_UPDATED, payload: musicMap });
    retrieveThumbnails(musicMap, idJwtToken)(dispatch);
};

const retrieveThumbnails = (music: Map<Artist, Music[]>, idJwtToken) => async dispatch => {
    let thumbnails = new Map<string, any>();
    for(const pair of music){
        let musicList = pair[1];
        for(let i = 0; i < musicList.length; i++){
            try {
                let thumbnailData = await Axios.request({ method: 'get',  url: musicUrl + '/' + musicList[i].uid+'/thumbnail', headers: { 'Authorization': idJwtToken }});
                let thumbnail = thumbnailData.data;
                thumbnails.set('' + musicList[i].uid, thumbnail);
                dispatch({ type: THUMBNAIL_UPDATED, payload:thumbnails });
            }
            catch(e){
                console.warn(e);
            }
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


