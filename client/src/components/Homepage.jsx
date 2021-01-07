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
          "bcf9cfb6-cae9-4b36-a840-00ef05a609a2",
          "caa2b3ca-65d0-4c47-b2a7-8cd9c219bc1f"
        )}
      >
        Join Session
      </button>
    </div>
  );
}
