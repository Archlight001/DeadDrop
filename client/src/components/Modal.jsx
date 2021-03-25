import React from "react";
import Rodal from "rodal";

import "rodal/lib/rodal.css";

export default function Modal({
  showModal,
  modalStatus,
  email,
  setEmail,
  sendEmail,
  mode,
  sendSessionData,
  sID,
  setSID,
  uID,
  setUID,
}) {
  return (
    <Rodal
      visible={modalStatus}
      onClose={() => {
        showModal(false);
      }}
      customStyles={{backgroundColor: '#c9d1da'}}
      width={400}
      height={220}
      showCloseButton={true}
    >
      {mode === "create" && (
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
      )}

      {mode === "join" && (
        <form onSubmit={sendSessionData}>
          <div className="codename__modal">
            <input
              type="text"
              placeholder="Enter Session ID"
              onChange={(e) => {
                setSID(e.target.value);
              }}
              value={sID}
              required
            />
            <input
              type="text"
              placeholder="Enter User ID"
              onChange={(e) => {
                setUID(e.target.value);
              }}
              value={uID}
              required
            />
            <button className="create__session__button" type="submit">
              Join Session
            </button>
          </div>
        </form>
      )}
    </Rodal>
  );
}
