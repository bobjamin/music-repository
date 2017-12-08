import * as React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';


const AddMusic = (props) => (
    <div id="page-content-wrapper" style={{ width: '100%', paddingTop: '50px' }}>
        <div style={{ fontWeight: 'lighter' as 'lighter', borderRadius: '5px', backgroundColor: 'rgb(35, 53, 63)', color: 'rgb(180, 191, 195)', padding: '30px 50px' }} className="container col-4 clearfix">
            <h1 style={{ textAlign: 'center', fontWeight: 'lighter' as 'lighter', paddingBottom: '20px'}}>Add New Music</h1>
            <div className="form-group" >
                <label htmlFor="formGroupGenre">Genre</label>
                <input id="formGroupGenre" className="form-control" type="text" />
            </div>
            {/*<AddArtistsComponent artists={this.props.artistsState.artists} />*/}
            <div className="form-group" >
                <label htmlFor="formGroupOpus">Opus</label>
                <input id="formGroupOpus" className="form-control" type="text" />
            </div>
            <div className="form-group" >
                <label htmlFor="formGroupNumber">Number</label>
                <input id="formGroupNumber" className="form-control" type="text" />
            </div>
            <div className="form-group" >
                <label htmlFor="formGroupName">Name</label>
                <input id="formGroupName" className="form-control" type="text" />
            </div>
            <div className="form-group" >
                <label htmlFor="formGroupPdf">Pdf</label>
                <input id="formGroupPdf" className="form-control" type="file" onChange={this.openFile}/>
            </div>
            <Button style={{ float: 'right' }} className="btn-primary" onClick={this.addMusic}>Save</Button>
            <Link to='/music'><Button style={{ float: 'left' }} className="btn-primary">Cancel</Button></Link>
        </div>
    </div>
);

export default AddMusic;
