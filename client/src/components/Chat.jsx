import React from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";

function Chat() {
  return (
    <div className="main__chat__container">
      <div className="chat__session__buttons">
        <button>Participants</button>
        <button>End Session</button>
      </div>

      <div className="chat__section">
        <div className="message__field">
          <h4>Wolf has joined the chat</h4>
          <div className="message__content__L">
            <p className="content__title">Wolf</p>
            <p className="content__message">
              Hi, I hope you've got the package for me
            </p>
          </div>
          
          <h4>Wolf has joined the chat</h4>
          <div className="side__right">
            <div className="message__content__R">
              <div>
                <p className="content__title">Lion</p>
              </div>
              <p className="content__message">Right here, come get it</p>
            </div>
          </div>

          <div className="side__right">
            <div className="message__content__R">
              <div>
                <p className="content__title">Lion</p>
              </div>
              <p className="content__message">Right here, come get it</p>
            </div>
          </div>

          <div className="message__content__L">
            <p className="content__title">Wolf</p>
            <p className="content__message">
              Hi, I hope you've got the package for me
            </p>
          </div>
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
