import React from "react";
//import _ from 'lodash';


const Numbers = (props) => {
    // const arrayOfNumbers = _.range(1, 10);    

    const numberClassName = (number) => {
        if (!props.startGame) {
            return 'used'; 
        }
        
        if (props.usedNumbers.indexOf(number) >=0) {
            return 'used'; // css class returned!
        }

        if (props.selectedNumbers.indexOf(number) >=0) {
            return 'selected'; // css class returned!
        }
    };

    return (
        <div className="well text-center">
            {Numbers.list.map((number, i) =>
                <span 
                    key={i} className={numberClassName(number)}
                    onClick={() => {if (props.startGame) props.selectNumber(number)}}>
                {number}</span>
            )}

        </div>
    );
}

export default Numbers