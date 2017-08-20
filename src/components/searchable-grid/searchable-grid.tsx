import * as React from 'react';
import ChangeEvent = React.ChangeEvent;
import {Searchbar} from "../searchbar/searchbar";
import {Grid} from "../grid/grid";
import {Music} from "../../model/music";
import Artist from "../../model/artist";

export interface SearchableGridProps  { music:Map<Artist, Music[]> }

export class SearchableGrid extends React.Component<SearchableGridProps,any>{

    constructor(){
        super();
        this.textChanged = this.textChanged.bind(this);
        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.state = {
            initialized: false,
            music: new Map<Artist, Music[]>()
        };
    }

    componentWillUpdate(){
        if(!this.state.initialized){
            this.setState({initialized: true});
            this.searchTextChanged("");
        }
    }

    searchTextChanged(text: string){
        let music = this.props.music;
        let filteredMusic = new Map<Artist, Music[]>();
        if(text == ""){
            filteredMusic = music;
        }
        else {
            if (music != null) {
                music.forEach((value: Music[], artist) => {
                    let musicMatchList = this.matchingMusic(value, artist, text);
                    if(musicMatchList.length > 0){
                        filteredMusic.set(artist, musicMatchList);
                    }
                });
            }
        }
        this.setState({music: filteredMusic});
    }

    matchingMusic(music: Music[], artist: Artist, searchString: string): Music[]{
        let matchingList = [];
        music.forEach(piece => {
            if(this.match(piece, artist, searchString)){
                matchingList.push(piece);
            }
        });
        return matchingList;
    }

    match(music: Music,artist: Artist, searchString: string){
        let filter = searchString.toLowerCase();
        console.log(filter);
        let match = artist.name().toLowerCase().indexOf(filter) != -1 || music.pieceName().toLowerCase().indexOf(filter) != -1;
        console.log(match);
        return match;
    }

    textChanged(event: ChangeEvent<HTMLInputElement>){
        this.searchTextChanged(event.target.value);
    }

    render(){
        return(
            <div className="container">
                <div className="row search-bar-row">
                    <Searchbar searchTextChanged={this.searchTextChanged}/>
                </div>
                <div className="row content-row">
                    <Grid music={this.state.music}/>
                </div>
            </div>
        );
    }
}