import store from "../state/store/store";
import * as Actions from '../state/actions/actions'
import {Music} from "../model/music";
import Artist from "../model/artist";

export function retrieveMusic(): Promise<any> {
    return new Promise((resolve, reject) => {
        store.dispatch(Actions.GET_MUSIC_SUCCESS(music()));
        resolve();
    });
}

const music = (): Map<Artist, Music[]> =>{
    let mappedMusic = new Map<Artist, Music[]>();
    let music = musicList();
    let artists = artistList();
    let otherArtist = new Artist(-1, "", "Other");
    music.forEach(music => {
        var artist = artists.get(music.artist);
        if(artist == null){
            artist = otherArtist
        }
        if(!mappedMusic.has(artist)){
            mappedMusic.set(artist, []);
        }
        mappedMusic.get(artist).push(music);
    });
    return mappedMusic;
};



const musicList = () => {
    let music = [];

    for(var i = 0;i<50;i++){
        var m1 = new Music(i, 'Hungarian Rhapsody No. ' + i,'Rhapsody', 2);
        m1.artist = 1;
        music.push(m1);
        var m2 = new Music(i+50,null,'Ballad', i);
        m2.artist = 0;
        music.push(m2);
    }
    return music;
};

const artistList = () => {
    let artists = [
        new Artist(0, 'Frederic', 'Chopin'),
        new Artist(1, 'Franz', 'Liszt')
    ];
    let mappedArtists = new Map<number, Artist>();
    artists.forEach(artist => mappedArtists.set(artist.uid, artist));
    return mappedArtists;
};