import React from 'react';

const TimerInput = (props) => {
      return (
       <div >
          <button className="btn"
                onClick={props.myTimer}>
                Start/Pause</button>
          <h3>Timer: {props.seconds}</h3>
          
      </div>
      );
}

export default TimerInput     





