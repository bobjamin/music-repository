import * as React from 'react';

export default (props: { searchTextChanged: (searchText) => void, initialText: string }) => (
    <div className="search-bar-wrapper" style={searchBarWrapperStyle}>
        <input value={props.initialText} onChange={(event) => props.searchTextChanged(event.target.value)} type="text" className="search-bar form-control" placeholder="Search Music" style={searchBarStyle}/>
        <i className="fa fa-search search-icon" style={searchIconStyle}/>
    </div>
)

const searchBarWrapperStyle = {
    width: '90%',
    margin: '2px 20px',
    position: 'relative' as 'relative',
    display: 'block',
    overflow: 'hidden' as 'hidden'
};

const searchBarStyle = {
    border: '0',
    height: '50px',
    padding: '10px 20px 10px 50px',
    borderRadius: '2px',
    width: '100%',
    fontSize: '15px',
    color: '#b4bfc3',
    backgroundColor: 'rgba(101, 106, 109, 0.24)'
};

const searchIconStyle = {
    top: '15px',
    left: '12px',
    height: '100%',
    fontSize: '20px',
    color: '#b4bfc3',
    position: 'absolute' as 'absolute',
    cursor: 'pointer'
};