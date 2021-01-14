import React, { useState } from "react";
import { useMain } from "../contexts/MainProvider";

import Modal from "./Modal";
export default function Homepage() {
  const [modalStatus, showModal] = useState(false);
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("");

  const [sID,setSID] = useState("")
  const [uID,setUID] = useState("")

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
    <div>
      <Modal
        showModal={showModal}
        modalStatus={modalStatus}
        email={email}
        setEmail={setEmail}
        sendEmail={sendEmail}
        mode={mode}
        sendSessionData={sendSessionData}
        sID = {sID}
        setSID = {setSID}
        uID = {uID}
        setUID = {setUID}
      />

      <button
        onClick={() => {
          setMode("create");
          showModal(true);
        }}
      >
        Create Session
      </button>
      {/* <button onClick={createSession.bind(this, "christoherenok@gmail.com")}>
        Create Session
      </button> */}
      <button
        onClick={() => {
          setMode("join");
          showModal(true);
        }}
      >
        Join Session
      </button>
    </div>
  );
}
