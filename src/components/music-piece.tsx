import * as React from 'react';
const pdfThumbnail = require('../assets/images/pdf-thumbnail.png');


export default class MusicPiece extends React.Component<any, any>{

    componentWillMount(){
        this.setState({selected: false});
    }

    onClick(){
        this.setState({selected: !this.state.selected});
    }

    styleForThumbnail(){
        let style = {};
        if(this.state.selected){
             style['border'] = '2px solid #44b6df';
        }
        return style;
    }

    render(){
        return <div className="grid-item col-md-3 col-xs-6" style={{ padding: '10px', paddingLeft: '20px' , backgroundColor: 'transparent' }}>
            <div className="thumbnail">
                <figure onClick={this.props.thumbnailClicked} style={this.styleForThumbnail()} className="thumbnailOverlay">
                    <img className="grid-item-img" src={ this.props.thumbnail? 'data:image/png;base64,' + this.props.thumbnail : pdfThumbnail } width="100%"/>
                </figure>
                <h4>{this.props.piece.pieceName()}</h4>
            </div>
        </div>
    }
}