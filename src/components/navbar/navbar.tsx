import * as React from 'react';

export interface NavbarProps {  }

export class Navbar extends React.Component<NavbarProps,any>{
    render(){
        return(
            <nav className="navbar navbar-fixed-top" id="navbar-wrapper" role="navigation" style={style}>

            </nav>
        );
    }
}

const style = {
    height: '60px',
    width: '100%',
    backgroundColor: 'rgb(35, 53, 63)'
};