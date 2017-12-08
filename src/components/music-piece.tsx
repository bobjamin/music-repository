import * as React from 'react';
const pdfThumbnail = require('../assets/images/pdf-thumbnail.png');

const MusicPiece = (props) => (
    <div className="grid-item col-md-3 col-xs-6" style={{ marginLeft: '20px', padding: '10px', backgroundColor: 'transparent' }}>
        <div className="thumbnail">
            <figure onClick={ props.thumbnailClicked } className="thumbnailOverlay">
                <img className="grid-item-img" src={ props.thumbnail? 'data:image/png;base64,' + props.thumbnail : pdfThumbnail } width="100%"/>
            </figure>
            <h4>{props.text}</h4>
        </div>
    </div>
);

export default MusicPiece;