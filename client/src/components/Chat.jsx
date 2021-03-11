import React, { useCallback, useEffect, useMemo, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";
import { useHistory } from "react-router-dom";
import { useMain } from "../contexts/MainProvider";
import Participants from "./Participants";
import { apiCall } from "../utils/connect";
import { useChat } from "../contexts/ChatProvider";
import { useSocket } from "../contexts/SocketProvider";

function Chat() {
  let history = useHistory();
  let { data, setData, isAdmin } = useMain();
  let { chatLog, addToChat } = useChat();
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

    console.log("Data is ", data);

    if (data !== null) {
      getParticipantsData();
    }
  }, []);

  async function endSession() {
    let UserId = data.UserId;
    let SessionID = data.SessionId;
    let deleteSession = await apiCall("post", "/api/deleteSession", {
      UserId,
      SessionID,
    });

    if (deleteSession.status === "success") {
      localStorage.removeItem("Data");
      setData(null);
      history.push("/");
    } else {
      alert("An error has occurred");
    }
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

  async function editCodename(UserId) {
    var newCodename = prompt("Enter your new Codename");
    if (newCodename.trim() !== "") {
      var con = window.confirm(`Changing codename to ${newCodename} ?`);
      if (con) {
        var SessionID = data.SessionId;
        var editOperation = await apiCall("post", "/api/editCodename", {
          SessionID,
          UserId,
          newCodename,
        });
        if (editOperation.status === "success") {
          let newData = { ...data, Codename: editOperation.newCodename };
          localStorage.setItem("Data", JSON.stringify(newData));
          setData(newData);
          setParticipants(editOperation.Participants);
        }
      }
    }
  }

  let [messageInput, setMessageInput] = useState("");

  function sendMessage(e) {
    e.preventDefault();
    let message = {
      type: "message",
      direction: "left",
      User: data.Codename,
      Message: messageInput,
    };

    let newArray = [...chatLog, message];
    socket.emit("new-message", { ...message, sessionId: data.SessionId });
    addToChat(newArray);

    scrollField();

    setMessageInput("");
  }

  function onEnterPress(e) {
    if (["Enter"].includes(e.key)) {
      sendMessage(e);
    }
  }

  let displayChats = chatLog.map((chat, index) => {
    if (chat.type === "announcement") {
      return <h4 key={index}>{chat.content}</h4>;
    } else if (chat.type === "message") {
      if (chat.direction === "left") {
        return (
          <div key={index} className="message__content__L">
            <p className="content__title">{chat.User}</p>
            <p className="content__message">{chat.Message}</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="side__right">
            <div className="message__content__R">
              <div>
                <p className="content__title">{chat.User}</p>
              </div>
              <p className="content__message">{chat.Message}</p>
            </div>
          </div>
        );
      }
    }
    return <div key={index}></div>;
  });

  //Make message field always scroll to the bottom
  function scrollField(){
    var element = document.getElementsByClassName("message__field")
    element[0].scrollTop = element[0].scrollHeight;
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
          editCodename={editCodename}
          isAdmin={isAdmin}
          CurrentUserId={data.UserId}
        />
      )}

      <div className="chat__section">
        <div className="message__field">
          {/* <h4>Wolf has joined the chat</h4> */}

          {displayChats}

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
        <form onKeyDown={onEnterPress} onSubmit={(e) => e.preventDefault()}>
          <div className="input__container">
            <div>
              <input
                type="text"
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
              />
              <SendIcon onClick={sendMessage} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
