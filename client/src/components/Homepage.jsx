import React from "react";
import {useMain} from "../contexts/MainProvider";


export default function Homepage() {
  
  const {createSession} = useMain()

  return (
    <div>
      <button onClick={createSession}>Create Session</button>
      <button>Join Session</button>
    </div>
  );
}
