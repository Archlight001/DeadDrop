import React, { useRef, useState } from "react";
import Rodal from "rodal";
import { useMain } from "../contexts/MainProvider";

import "rodal/lib/rodal.css";

export default function Homepage() {
  const [modalStatus, showModal] = useState(false);
  const [email, setEmail] = useState("");

  const { createSession } = useMain();

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
        <form onSubmit={createSession.bind(this, email)}>
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
      {/* <button onClick={() => showModal(true)}>Create Session</button> */}
      <button onClick={createSession.bind(this, "christopherenok@gmail.com")}>Create Session</button>
      <button>Join Session</button>
    </div>
  );
}
