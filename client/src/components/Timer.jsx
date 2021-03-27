import React from "react";
import Countdown from 'react-countdown';

function Timer({ sessionTime }) {
  var currentDate = new Date();
  console.log("Current date is ", currentDate.getTime());

  var remainingTime = new Date(sessionTime - currentDate.getTime());
  console.log("Remaining Time is ", remainingTime.getTime());

  var timertime = new Date(remainingTime);

  console.log("Timer time is ", timertime.getHours());


  //console.log(date);
  return (
    <div className="chat__timer">
      <Countdown date={Date.now()+timertime.getTime()} />
    </div>
  );
}

export default Timer;
