import React, { useCallback, useEffect, useMemo, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";
import { useHistory } from "react-router-dom";
import { useMain } from "../contexts/MainProvider";
import { useSocket } from "../contexts/SocketProvider";
import Participants from "./Participants";
import { apiCall } from "../utils/connect";

function Chat() {
  let history = useHistory();
  let { data, setData, isAdmin } = useMain();
  let { socket } = useSocket();

  let [participantsDisplayStatus, displayParticipants] = useState(false);

  let [participants, setParticipants] = useState([]);
  let [onlineParticipants, setOnlineParticipants] = useState([]);

  useEffect(() => {
    async function getParticipantsData() {
      let chatParticipants = await apiCall("post", "/api/getParticipants", {
        id: data.SessionId,
      });
      setParticipants(chatParticipants);
    }

    getParticipantsData();
  }, []);

  function endSession() {
    localStorage.removeItem("Data");
    setData(null);
    history.push("/");
  }

  function showParticipants() {
    displayParticipants(true);
    socket.emit("get-participants");
    socket.on("get-participants", (data) => {
      setOnlineParticipants(data);
    });
  }

  async function deleteParticipant(UserId) {
    var val = window.confirm("You are about to delete a user");
    if (val) {
      var SessionID = data.SessionId;
      let deleteOperation = await apiCall("post", "/api/deleteParticipant", {
        SessionID,
        UserId,
      });
      if (deleteOperation.deleted) {
        setParticipants(deleteOperation.Participants);
      }
    }
  }

  async function editCodename(UserId){
    var newCodename = prompt("Enter your new Codename");
    if(newCodename.trim() !== ""){
      var con = window.confirm(`Changing codename to ${newCodename} ?`)
      if(con){
        var SessionID = data.SessionId;
        var editOperation = await apiCall("post","/api/editCodename",{SessionID,UserId,newCodename})
        if(editOperation.status === "success"){
          let newData = {...data,Codename:editOperation.newCodename}
          localStorage.setItem("Data",JSON.stringify(newData))
          setData(newData)
          setParticipants(editOperation.Participants)
        }
      }
    }
  }

  return (
    <div className="main__chat__container">
      <div className="chat__session__buttons">
        <button onClick={showParticipants}>Participants</button>
        <button onClick={endSession}>End Session</button>
      </div>

      {participantsDisplayStatus && (
        <Participants
          displayParticipants={displayParticipants}
          participantsDisplayStatus={participantsDisplayStatus}
          onlineParticipants={onlineParticipants}
          SessionId={data.SessionId}
          participants={participants}
          setParticipants={setParticipants}
          deleteParticipant={deleteParticipant}
          editCodename = {editCodename}
          isAdmin={isAdmin}
          CurrentUserId={data.UserId}
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
