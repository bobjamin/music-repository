import Axios from 'axios';
import Artist from "../model/artist";
import {Music} from "../model/music";

const musicUrl = 'https://0p5q8ygv39.execute-api.eu-west-1.amazonaws.com/dev/music';
const artistUrl = 'https://begbh03p5g.execute-api.eu-west-1.amazonaws.com/dev/artists';

export const SEARCH_TEXT_CHANGED = 'music/SEARCH_TEXT_CHANGED';
export const MUSIC_UPDATED = 'music/MUSIC_UPDATED';
export const THUMBNAIL_UPDATED = 'music/THUMBNAIL_UPDATED';

const initialState = {
    searchText: "",
    music: new Map<Artist, Music[]>(),
    thumbnails: new Map<string, string>()
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_TEXT_CHANGED:
            return {
                ...state,
                searchText: action.payload
            };
        case MUSIC_UPDATED:
            return {
                ...state,
                music: action.payload
            };
        case THUMBNAIL_UPDATED:
            return {
                ...state,
                thumbnails: action.payload
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

export async function getSheetMusicFor(uid: string, idJwtToken): Promise<string>{
    let data = await Axios.request({ method: 'get',  url: musicUrl + '/' + uid + "/pdf", headers: { 'Authorization': idJwtToken }});
    return data.data;
}


