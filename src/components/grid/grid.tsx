import * as React from 'react';
import {GridItem} from "./grid-item/grid-item";
import {Music} from "../../model/music";
import Artist from "../../model/artist";

export interface GridProps { music:Map<Artist, Music[]> }

export class Grid extends React.Component<GridProps,any>{

    titleFor(artist: Artist){
        var name = artist.name();
        return (
            <div style={headingStyle}>
                <h4 key={name} style={headingTextStyle}>{name}</h4>
            </div>
        )
    }

    gridItems(){
        let items = [];
        if(this.props.music) {
            this.props.music.forEach((value, artist: Artist) => {
                items.push(this.titleFor(artist));
                let musicList = [];
                value.forEach((music, index) => {
                    musicList.push(
                        <GridItem key={artist.lastName + index} item={music}/>
                    );
                });
                items.push(( <div className="row">{musicList}</div>));
            });

        }
        return items;

    }

    render(){
        return(
            <div className="grid row col-sm-12" style={gridStyle}>
                { this.gridItems() }
            </div>
        );
    }
}

const gridStyle = {

};

const headingStyle = {
    width: '100%',
    borderBottom: '1px solid rgb(48, 59, 82)',
    padding: '10px',
    paddingTop: '30px'
};

const headingTextStyle = {
    textAlign: 'left'
};