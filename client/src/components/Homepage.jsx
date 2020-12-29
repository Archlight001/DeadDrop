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
          "2c72d020-4ba3-44c3-aaac-f0c004216618",
          "2152dr4b-4b86-4c58-922b-14ff4a2c1eb3"
        )}
      >
        Join Session
      </button>
    </div>
  );
}
