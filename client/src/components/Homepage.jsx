import React, { useRef, useState } from "react";
import Rodal from "rodal";
import { useMain } from "../contexts/MainProvider";

import "rodal/lib/rodal.css";

export default function Homepage() {
  const [modalStatus, showModal] = useState(false);
  const [email, setEmail] = useState("");

  const { createSession,joinSession } = useMain();

  function sendEmail(e){
    e.preventDefault()
    createSession(email)
    showModal(false)
  }
  return (
    <div>
      <Rodal
        visible={modalStatus}
        onClose={() => {
          showModal(false);
        }}
        width={400}
        height={200}
        showCloseButton={true}
      >
        <form onSubmit={sendEmail}>
          <div className="codename__modal">
            <input
              type="email"
              placeholder="Enter your Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              required
            />
            <button className="create__session__button" type="submit">
              Create Session
            </button>
          </div>
        </form>
      </Rodal>
      <button onClick={() => showModal(true)}>Create Session</button>
      {/* <button onClick={createSession.bind(this, "christoherenok@gmail.com")}>
        Create Session
      </button> */}
      <button
        onClick={joinSession.bind(
          this,
          "b6cb9b56-20a8-482b-bd0a-1a2d97c39f46",
          "02fbfd70-43b6-4692-9a47-b26a3e78fe66"
        )}
      >
        Join Session
      </button>
    </div>
  );
}
