const db = require("../models/index");
const {
  generateCodeName,
  generateCodeNameP,
} = require("../helpers/codenameGen");

exports.validate = async function validateMail(req, res, next) {
  const Email = req.body.Email;
  const SessionID = req.body.SessionId;

  const Codename = generateCodeName();

  console.log("Codename ", Codename);

  if (Email !== undefined) {
    var checkSession = await db.Session.find({ Email });
  } else {
    var checkSession = await db.Session.find({ SessionID });
  }

  if (checkSession.length !== 0) {
    console.log(checkSession[0]);
    let currentDate = new Date();
    let { id, Date: SessionDate, Codename } = checkSession[0];

    if (currentDate.getTime() > SessionDate) {
      //Delete Entry
      await checkSession[0].remove();
      return res.status(200).json({ exists: false });
    } else {
      if (SessionID !== undefined) {
        return res
          .status(200)
          .json({ exists: true, Date: SessionDate, Codename });
      } else {
        return res.status(200).json({ exists: true });
      }
    }
  } else {
    return res.status(200).json({ exists: false, Codename });
  }
};

exports.getParticipants = async function getParticipants(req, res, next) {
  const chatParticipants = [];
  let SessionID = req.body.id;
  let getSessionData = await db.Session.find({ SessionID });

  chatParticipants.push({
    UserId: getSessionData[0].UserId,
    Email: getSessionData[0].Email,
    Codename: getSessionData[0].Codename,
  });

  if (getSessionData[0].Participants.length > 0) {
    getSessionData[0].Participants.forEach((user) => {
      chatParticipants.push({
        UserId: user.id,
        Email: user.email,
        Codename: user.Codename,
      });
    });
  }

  return res.status(200).json(chatParticipants);
};

exports.addParticipant = async function addParticipant(req, res, next) {
  let email = req.body.email;
  let id = req.body.id;
  let session = req.body.session;

  const Codename = await generateCodeNameP(session);

  let addParticipant = await db.Session.find({ SessionID: session });

  if (addParticipant.length > 0) {
    addParticipant[0].Participants.push({ id, email, Codename, session });
    let save = await addParticipant[0].save();
    if (save.SessionID !== undefined) {
      let Participants = [];
      Participants.push({
        UserId: save.UserId,
        Email: save.Email,
        Codename: save.Codename,
      });

      if (save.Participants.length > 0) {
        save.Participants.forEach((user) => {
          Participants.push({
            UserId: user.id,
            Email: user.email,
            Codename: user.Codename,
          });
        });
      }
      return res.status(200).json({ Participants, status: true });
    } else {
      return res.status(500).json({ status: false });
    }
  }

  return res.status(500).json({ status: false });
};
