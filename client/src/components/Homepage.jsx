import React, { useRef, useState } from "react";
import Rodal from "rodal";
import { useMain } from "../contexts/MainProvider";

import "rodal/lib/rodal.css";

export default function Homepage() {
  const [modalStatus, showModal] = useState(false);
  const [codeName, setCodeName] = useState("");

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
        <form onSubmit={createSession.bind(this, codeName)}>
          <div className="codename__modal">
            <input
              type="text"
              placeholder="Enter your Codename"
              onChange={(e) => {
                setCodeName(e.target.value);
              }}
              value={codeName}
              required
            />
            <button className="create__session__button" type="submit">
              Create Session
            </button>
          </div>
        </form>
      </Rodal>
      <button onClick={() => showModal(true)}>Create Session</button>
      <button>Join Session</button>
    </div>
  );
}
