import React from "react";
import Rodal from "rodal";

import GreenIcon from "../images/greenIcon.ico";
import GrayIcon from "../images/grayIcon.ico";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";

export default function Participants({
  displayParticipants,
  participantsDisplayStatus,
}) {
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
        <div className="participants__list__item">
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
        </div>        
        
      </div>

      <div className="add__participant">
        <button className="btn__add__participant">Add Participant</button>
      </div>
    </Rodal>
  );
}
