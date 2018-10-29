import React, { Component } from 'react';
import Stars from './Stars';
import Button from './Button';
import Answer from './Answer';
import Numbers from './Numbers';
import DoneFrame from './DoneFrame';
import TimerInput from './TimerInput'
import _ from 'lodash'

var possibleCombinationSum = (arr, n) => {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  
  return false;
}; 


class Game extends Component {
  
  //def of class level function
  static randomNumber = () => 1 + Math.floor(Math.random()*9);
  
  // Timer interval
  static myInterval = (func) => setInterval(func, 1000);

  // reset state
  static initialState = () => ({
    selectedNumbers : [],
    randomNumberOfStars : Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    redraws: 5,
    doneStatus: null,
    // Clock:
    startGame: false,
    seconds: 60,
    myInt : null,
      
  })

  state = Game.initialState();
            // number === clickedNumber
  selectNumber = (clickedNumber) => {
    // unable selection
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {return;}
    this.setState(prevState => ({
      // reset selection after match/dismatch
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  
  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers
                                .filter(number=> number !== clickedNumber)
    }))
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc,n)=> acc+n, 0) //bool
    }))
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber() ,
    }),
    // second arg for async
    this.updateDoneStatus);

  }

  redraw = () => {
    if (this.state.redraws === 0) {return;}
    this.setState(prevState => ({
      randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws-1,
    }),
    // second arg for async
    this.updateDoneStatus);
  }

  // need to read the state and thats not all props, distructured:
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    // array of used nums, original range filtered to remove all currently used.
    // and excluded
    const possibleNumbers = _.range(1,10).filter(number => 
      usedNumbers.indexOf(number) === -1
    );

    // does the arary of numbers has any combination of nums to sum up the value of the Stars?
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };


  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { 
          myInt:clearInterval(prevState.myInt),
          doneStatus: "Done. Nice!"};
      }
      if (
        (prevState.redraws === 0 &&
        !this.possibleSolutions(prevState)) ||
        this.state.seconds===0 ) {
        return { 
          myInt:clearInterval(prevState.myInt),
          doneStatus: "Game Over!"}
      }
    });
  }

  resetGame = () => this.setState(Game.initialState());


  // Timer
  myTimer = () => {
    if (this.state.startGame === false) {
      console.log()
      this.setState( () => ({
        startGame: true,
        myInt: Game.myInterval(this.timerFunction),
    }),
    // second arg for async
    this.updateDoneStatus);
    } else {
      console.log("true")
      this.setState( (prevState) => ({
        startGame: false,
        myInt:clearInterval(prevState.myInt),
      }))
    }
  }

  timerFunction = () => {
    if (this.state.seconds === 0) {
      this.setState( (prevState)=> ({
        startGame : false,
        myInt:clearInterval(prevState.myInt)
      }), this.updateDoneStatus 
    )} else {
      //console.log(this.state.seconds)
      this.setState( (prevState) => ({
        seconds: prevState.seconds - 1
      }), this.updateDoneStatus
    )}
  }       
  
  
  
  // UI implementation, this.state vars, disable/enable equal button.
  render() {
    const { 
        selectedNumbers, 
        randomNumberOfStars, 
        answerIsCorrect,
        usedNumbers,
        redraws,
        doneStatus,
        startGame,
        seconds,
      } = this.state;

    return (
      <div className="container">
        <h1>Play Nine</h1>
        <p>1. select number to match stars
           2. refresh if no match is possible 
           3. You got 60 sec.
           Good luck!
        </p>
        <div>
          <TimerInput seconds={seconds} startGame={startGame} myTimer={this.myTimer}/>
        </div>
        <hr />
        <div className="row">
            <Stars numberOfStars={randomNumberOfStars}/>
            <Button 
              selectedNumbers={selectedNumbers}
              checkAnswer={this.checkAnswer}
              answerIsCorrect={answerIsCorrect}
              acceptAnswer={this.acceptAnswer}
              redraw={this.redraw}
              redraws={redraws}
              startGame={startGame}/>
            <Answer 
              selectedNumbers={selectedNumbers}
              unselectNumber={this.unselectNumber}/>
        </div>
        <br />
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> :
          <Numbers 
          selectedNumbers={selectedNumbers}
          selectNumber={this.selectNumber}
          usedNumbers={usedNumbers}
          startGame={startGame}/>
        }
      </div>
    );
  }
}

export default Game;
