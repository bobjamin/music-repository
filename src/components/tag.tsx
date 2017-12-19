import * as React from 'react';
const COLORS = require("flat-colors");


const color = () => {
    let color = COLORS();
    while(color[0] + color[1] + color[2] > 400){
        color = COLORS();
    }
    return color[3];
};

const Tag = (props) => (
    <div className={"tag" + (props.new?" tag-add": "")} title={props.new?'Add Tag':''} style={props.new?{cursor:'pointer'}:{backgroundColor: color()}}>
        {props.text}
        {
            props.new
            ? <i onClick={props.addClicked} className="fa fa-plus"/>
            : <i onClick={props.removeClicked} className="fa fa-times tag-icon" title='Remove Tag'/>
        }

    </div>
);

export default Tag;