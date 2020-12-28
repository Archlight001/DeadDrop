const { json } = require("express");
const db = require("../models/index");

exports.addSession = async function addSession(
  SessionID,
  Email,
  UserId,
  Date,
  Participants
) {
  let findSession = await db.Session.find({ SessionID: SessionID });

  if (findSession.length > 0) {
    let { SessionID, Email, UserId, Date, Participants } = findSession[0];
    return { SessionID, Email, UserId, Date, Participants };
  } else {
    let newSession = { SessionID, Email, UserId, Date, Participants };
    let session = await db.Session.create(newSession);
    return session;
  }
};
