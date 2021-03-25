import React, { useState } from "react";
import ChatLogo from "../images/chat.png";
import { useMain } from "../contexts/MainProvider";

import Modal from "./Modal";
export default function Homepage() {
  const [modalStatus, showModal] = useState(false);
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("");

  const [sID, setSID] = useState("");
  const [uID, setUID] = useState("");

  const { createSession, joinSession } = useMain();

  function sendEmail(e) {
    e.preventDefault();
    createSession(email);
    showModal(false);
    setMode("");
  }

  function sendSessionData(e) {
    e.preventDefault();
    joinSession(sID, uID);
    showModal(false);
    setMode("");
  }
  return (
    <div className="homepage">
      <Modal
        showModal={showModal}
        modalStatus={modalStatus}
        email={email}
        setEmail={setEmail}
        sendEmail={sendEmail}
        mode={mode}
        sendSessionData={sendSessionData}
        sID={sID}
        setSID={setSID}
        uID={uID}
        setUID={setUID}
      />

      <div className="section__buttons">
        <button
          onClick={() => {
            setMode("create");
            showModal(true);
          }}
        >
          <p>Create Session</p>
        </button>
        <button
          onClick={() => {
            setMode("join");
            showModal(true);
          }}
        >
          <p>Join Session</p>
        </button>
      </div>
      <div className="section__body">
        <div className="section__body__title">
          <h1>DEADDROP</h1>
          <p>Online hive to talk privately</p>
        </div>
        <div className="section__body__image">
          <img src={ChatLogo} alt="Chat" />
        </div>
      </div>
    </div>
  );
}
