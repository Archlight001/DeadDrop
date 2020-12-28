import React, { useEffect, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";
import { useHistory } from "react-router-dom";
import {useMain} from "../contexts/MainProvider";

// const socket = io("http://localhost:5000",{forceNew:false});
// socket.emit("enter-chat", "James");

function Chat() {
  let history = useHistory()  
  let {data,setData} = useMain();

  // const [messages, addMessage] = useState([]);
  // const [name,setName] = useState("Jes")

  // useEffect(() => {
  //   console.log()
  //   socket.on("new-participant", participant =>{
  //     console.log("Rendering");
  //     addMessage(<h4>{participant} has joined the chat</h4>)
  //   });

  // },[]);

  function endSession(){
    localStorage.removeItem("Data");
    setData(null)
    history.push("/");
  } 

 

  return (
    <div className="main__chat__container">
      <div className="chat__session__buttons">
        <button>Participants</button>
        <button onClick={endSession}>End Session</button>
      </div>

      <div className="chat__section">
        <div className="message__field">
          {/* <h4>Wolf has joined the chat</h4> */}


          {/* <div className="message__content__L">
            <p className="content__title">Wolf</p>
            <p className="content__message">
              Hi, I hope you've got the package for me
            </p>
          </div> */}

          {/* <div className="side__right">
            <div className="message__content__R">
              <div>
                <p className="content__title">Lion</p>
              </div>
              <p className="content__message">Right here, come get it</p>
            </div>
          </div> */}
        </div>
        <div className="input__container">
          <div>
            <input type="text" name="" id="" />
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
