import {Music} from "../../model/music";
import Artist from "../../model/artist";
export const GET_MUSIC_SUCCESS = (music : Map<Artist, Music[]>): {type: any, payload: Map<Artist, Music[]> } => (
{
    type: GET_MUSIC_SUCCESS,
    payload: music
});