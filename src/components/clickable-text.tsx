import * as React from 'react';
import { Button } from 'react-bootstrap';
import * as UUID from 'uuid'

export default class ClickableText extends React.Component<{onClick:(string)=>void, buttonText:string}, any>{
    id: string;
    constructor(props, context){
        super(props as any, context);
        this.id = UUID.v4();
    }

    onClick(){
        this.props.onClick((document.getElementById(this.id) as HTMLInputElement).value)
    }

    render(){
        return (
            <div>
                <input type="text" id={this.id} className="clickableText" style={
                        {   border: '1px solid grey',
                            borderRadius: '2px',
                            color: 'rgb(181, 191, 196)',
                            margin: '0px -4px 10px 0px',
                            backgroundColor: 'rgb(36, 53, 63)',
                            height: '37px',
                            paddingLeft: '10px',
                            width:'60%'
                        }}/>
                <Button className="btn-primary" style={{ marginTop: '-4px', borderRadius: '2px', width:'40%' }} onClick={this.onClick.bind(this)}>{this.props.buttonText}</Button>
            </div>
        );
    }
}