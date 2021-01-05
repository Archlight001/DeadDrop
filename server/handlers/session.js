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

  console.log(Codename);
  if (Codename !== undefined) {
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
  }

  return res.status(500).json({ status: false });
};

exports.deleteParticipant = async function deleteParticipant(req, res, next) {
  try {
    var SessionID = req.body.SessionID;
    var UserId = req.body.UserId;

    var Session = await db.Session.find({ SessionID });
    if (Session.length > 0) {
      Session[0].Participants = Session[0].Participants.filter(
        (user) => user.id !== UserId
      );
      let save = await Session[0].save();

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
        return res.status(200).json({ deleted: true, Participants });
      } else {
        return res.status(200).json({ deleted: false });
      }
    }
  } catch (error) {
    res.status(500).json({ deleted: false });
  }
};

exports.isAdmin = async function isAdmin(req, res, next) {
  try {
    let UserId = req.body.id;

    let isAdmin = await db.Session.find({ UserId });

    if (isAdmin.length > 0) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    res.status(500).json({ isAdmin: false });
  }
};
