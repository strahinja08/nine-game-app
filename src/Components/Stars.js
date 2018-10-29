import React from "react";
import _ from 'lodash';
// fontAwsome for stars


const Stars = (props) => {
    // rerendered on click, so moved up!
    //const numberOfStars = Math.floor(Math.random()*9);

    return (
        <div className="col-sm-5">
            {_.range(props.numberOfStars).map(i =>
            <i key={i} className="fa fa-star"></i>)}
        </div>
    );
}

export default Stars