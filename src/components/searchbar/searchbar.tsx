import * as React from 'react';
import ChangeEvent = React.ChangeEvent;

export interface SearchbarProps { searchTextChanged: (text:string)=>void }

export class Searchbar extends React.Component<SearchbarProps,any>{

    constructor(){
        super();
        this.textChanged = this.textChanged.bind(this);
    }

    textChanged(event: ChangeEvent<HTMLInputElement>){
        this.props.searchTextChanged(event.target.value);
    }

    render(){
        return(
            <div className="search-bar-wrapper" style={searchBarWrapperStyle}>
                <input onChange={this.textChanged} type="text" className="search-bar form-control" placeholder="Search Music" style={searchBarStyle}/>
                <i className="fa fa-search search-icon" style={searchIconStyle}/>
            </div>
        );
    }
}

const searchBarWrapperStyle = {
    width: '100%',
    margin: '2px 0',
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