import React from "react";
import Rodal from "rodal";
import { v4 as uuidv4 } from "uuid";

import GreenIcon from "../images/greenIcon.ico";
import GrayIcon from "../images/grayIcon.ico";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";

import { apiCall } from "../utils/connect";

export default function Participants({
  displayParticipants,
  participantsDisplayStatus,
  SessionId,
  participants,
  setParticipants,
}) {
  async function addParticipant() {
    const UserId = uuidv4();
    const email = prompt("Enter the Email of the Participant");
    let addParticipant = await apiCall("post", "/api/addParticipant", {
      email: email,
      session: SessionId,
      id: UserId,
    });
    if (addParticipant.status) {
      alert("Added Successfully");
      console.log(addParticipant);
      setParticipants(addParticipant.Participants);
    } else {
      alert("Operation Failed");
    }
  }

  const p = participants.map((participant) => (
    <div className="participants__list__item">
      <div className="list__name">
        <div>
          <p>{participant.Codename}</p>
          <p className="participant__email">{participant.Email}</p>
        </div>

        <EditIcon />
        <CancelIcon />
      </div>

      <div>
        <img src={GreenIcon} className="icon__indicator" alt="Online Icon" />
        <img
          src={GrayIcon}
          className="icon__indicator__gray"
          alt="Offline Icon"
        />
      </div>
    </div>
  ));

  return (
    <Rodal
      visible={participantsDisplayStatus}
      onClose={() => {
        displayParticipants(false);
      }}
      width={600}
      height={400}
      showCloseButton={true}
      customStyles={{ backgroundColor: "#232b2b" }}
    >
      <div className="participants__list__container">
        {/* <div className="participants__list__item">
          <div className="list__name">
            <div>
              <p>Codename</p>
              <p className="participant__email">name@email.com</p>
            </div>

            <EditIcon />
            <CancelIcon />
          </div>

          <div>
            <img
              src={GreenIcon}
              className="icon__indicator"
              alt="Online Icon"
            />
            <img
              src={GrayIcon}
              className="icon__indicator__gray"
              alt="Offline Icon"
            />
          </div>
        </div> */}

        {p}
      </div>

      <div className="add__participant">
        <button onClick={addParticipant} className="btn__add__participant">
          Add Participant
        </button>
      </div>
    </Rodal>
  );
}
