import * as React from 'react';
import Tag from "./tag";
const pdfThumbnail = require('../assets/images/pdf-thumbnail.png');

export default class MusicPiece extends React.Component<any, any>{

    componentWillMount(){
        this.setState({selected: false});
    }

    onClick(event){
        if(this.props.canSelect) {
            let newSelected = !this.state.selected;
            this.setState({selected: newSelected});
            this.props.selectionChanged(this.props.piece.uid, newSelected);
        }
        event.preventDefault();
    }

    onDoubleClick(){
        this.setState({selected: false});
        this.props.selectionChanged(this.props.piece.uid, this.state.selected);
        this.props.thumbnailClicked();
    }

    styleForThumbnail(){
        let style = {};
        if(this.state.selected){
             style['border'] = '2px solid #44b6df';
        }
        return style;
    }

    render(){
        return <div className="grid-item" style={{ padding: '10px', paddingLeft: '20px' , backgroundColor: 'transparent' }}>
            <div className="thumbnail">

                    <figure onContextMenu={this.onClick.bind(this)} onClick={this.onDoubleClick.bind(this)} style={this.styleForThumbnail()} className="thumbnailOverlay">
                        <img className="grid-item-img" src={ this.props.thumbnail? 'data:image/png;base64,' + this.props.thumbnail : pdfThumbnail } width="100%"/>
                    </figure>

                <h4>{this.props.piece.pieceName()}</h4>
            </div>
            {
                this.props.piece.tags && this.props.canSelect ?
                    this.props.piece.tags.map(tag => <Tag key={this.props.piece.uid + tag} text={tag}/>)
                : <div />
            }
                {this.props.canSelect ? <Tag new={true} />: <div/>}
        </div>
    }
}