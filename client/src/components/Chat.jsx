import React, { useEffect, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";
import { useHistory } from "react-router-dom";
import { useMain } from "../contexts/MainProvider";
import Participants from "./Participants";

function Chat() {
  let history = useHistory();
  let { data, setData } = useMain();

  let [participants, displayParticipants] = useState(false);

  function endSession() {
    localStorage.removeItem("Data");
    setData(null);
    history.push("/");
  }

  function showParticipants() {
    displayParticipants(true)
  }

  return (
    <div className="main__chat__container">
      <div className="chat__session__buttons">
        <button onClick={showParticipants}>Participants</button>
        <button onClick={endSession}>End Session</button>
      </div>

      {participants && (
        <Participants
          displayParticipants={displayParticipants}
          participantsDisplayStatus={participants}
        />
      )}

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
