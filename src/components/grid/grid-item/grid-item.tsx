import * as React from 'react';
import {Music} from "../../../model/music";

const pdfThumbnail = require('../../../assets/images/pdf-thumbnail.png');

export interface GridItemProps { item: Music }

export class GridItem extends React.Component<GridItemProps,any>{

    render(){
        return(
            <div className="grid-item col-md-3 col-sm-6" style={gridItemStyle}>
                <div className="thumbnail">
                    <img src={pdfThumbnail} width="100%"/>
                    <h4>{this.props.item.pieceName()}</h4>
                </div>
            </div>
        );
    }
}

const gridItemStyle = {
    height: '100%',
    padding: '10px',
    backgroundColor: 'transparent'
};