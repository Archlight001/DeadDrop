const { json } = require("express");
const db = require("../models/index");

exports.findSession = async function findSession(
  SessionID
) {
  let findSession = await db.Session.find({ SessionID: SessionID });

  if (findSession.length > 0) {
    let { SessionID, Email, UserId, Date, Participants } = findSession[0];
    return { SessionID, Email, UserId, Date, Participants };
  }
};
