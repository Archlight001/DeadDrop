import React, { useState, useRef } from "react";
import SendIcon from "@material-ui/icons/Send";
import "../css/Chat.css";
import { useHistory } from "react-router-dom";
import { useMain } from "../contexts/MainProvider";
import Participants from "./Participants";
import { apiCall } from "../utils/connect";
import { useChat } from "../contexts/ChatProvider";
import { useSocket } from "../contexts/SocketProvider";
import Timer from "./Timer";

function Chat() {
  let history = useHistory();
  let { data, setData, isAdmin } = useMain();
  let { chatLog, addToChat } = useChat();

  let { socket } = useSocket();

  const messageField = useRef();

  const scrollToBottom = () => {
    messageField.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  let [participantsDisplayStatus, displayParticipants] = useState(false);
  let [messageInput, setMessageInput] = useState("");
  let [participants, setParticipants] = useState([]);
  let [onlineParticipants, setOnlineParticipants] = useState([]);

  React.useEffect(() => {
    async function getParticipantsData() {
      let chatParticipants = await apiCall("post", "/api/getParticipants", {
        id: data.SessionId,
      });
      setParticipants(chatParticipants);
    }

    console.log("Data is ", data);

    if (data !== null && participants.length < 1) {
      getParticipantsData();
    }

    if (messageField.current) {
      console.log("Scrolling");
      scrollToBottom();
    }
  });

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

    //scrollField();
    setMessageInput("");
  }

  function onEnterPress(e) {
    if (["Enter"].includes(e.key)) {
      sendMessage(e);
    }
  }

  let displayChats = chatLog.map((chat, index) => {
    if (chat.type === "announcement") {
      return (
        <h4
          ref={index === chatLog.length - 1 ? messageField : React.createRef()}
          key={index}
        >
          {chat.content}
        </h4>
      );
    } else if (chat.type === "message") {
      if (chat.direction === "left") {
        return (
          <div
            ref={
              index === chatLog.length - 1 ? messageField : React.createRef()
            }
            key={index}
            className="message__content__L"
          >
            <p className="content__title">{chat.User}</p>
            <p className="content__message">{chat.Message}</p>
          </div>
        );
      } else {
        return (
          <div
            ref={
              index === chatLog.length - 1 ? messageField : React.createRef()
            }
            key={index}
            className="side__right"
          >
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

  console.log(data.date);
  return (
    <div className="main__chat__container">
      <div className="chat__heading">
        <Timer sessionTime={data.date} />

        <div className="chat__session__buttons">
          <button onClick={showParticipants}>Participants</button>
          <button onClick={endSession}>End Session</button>
        </div>
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
        <div className="message__field">{displayChats}</div>
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
