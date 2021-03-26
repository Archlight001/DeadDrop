const db = require("../models/index");
const nodemailer = require("nodemailer");
const {
  generateCodeName,
  generateCodeNameP,
} = require("../helpers/codenameGen");

const dotenv = require("dotenv");
dotenv.config();

// let transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "",
//     pass: "",
//   },
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

exports.createSession = async function (req, res, next) {
  const SessionID = req.body.SessionId;
  const Email = req.body.Email;
  const UserId = req.body.UserId;
  const Codename = req.body.Codename;
  const Date = req.body.date;
  const Participants = [];

  try {
    let newSession = { SessionID, Email, UserId, Codename, Date, Participants };
    let session = await db.Session.create(newSession);

    if (session) {
      return res.status(200).json({ status: "success" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.validate = async function validateMail(req, res, next) {
  const Email = req.body.Email;
  const SessionID = req.body.SessionId;
  const UserId = req.body.UserId;

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
    let {
      UserId: id,
      Date: SessionDate,
      Participants,
      Codename,
    } = checkSession[0];

    if (currentDate.getTime() > SessionDate) {
      //Delete Entry
      await checkSession[0].remove();
      return res.status(200).json({ exists: false });
    } else {
      if (SessionID !== undefined) {
        if (UserId === id) {
          return res
            .status(200)
            .json({ exists: true, Date: SessionDate, Codename });
        } else {
          let cName = "";
          Participants.every((participant) => {
            if (participant.id === UserId) {
              cName = participant.Codename;
              return false;
            }
            return true;
          });
          return res
            .status(200)
            .json({ exists: true, Date: SessionDate, Codename: cName });
        }
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
        let Participants = generateParticipants(save);

        //Send mail to invite participant
        let mailOptions = {
          from: "christopherenok@gmail.com",
          to: email,
          subject: "DeadDrop Session Invite",
          html: `<h1>You have been invited to a dead drop session</h1> <p><strong>Session ID</strong>:${session}</p><p><strong>Your ID</strong>:${id}</p>`,
        };

        let isSent = await sendMail(mailOptions);

        console.log("isSent is ", isSent);
        if (!isSent) return res.status(200).json({ status: false });

        return res.status(200).json({ Participants, status: true });
      } else {
        return res.status(500).json({ status: false });
      }
    }
  }

  return res.status(500).json({ status: false });
};

async function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        //Find and remove last added participant
        // let findParticipant = await db.Session.find({ SessionID: session });
        // findParticipant[0].Participants.pop();
        // let saver = await findParticipant[0].save();
        console.log("Error", err);
        reject(false);
      } else {
        console.log("returning true");
        resolve(true);
      }
    });
  });
}

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
        let Participants = generateParticipants(save);
        return res.status(200).json({ deleted: true, Participants });
      } else {
        return res.status(200).json({ deleted: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ deleted: false });
  }
};

exports.isAdmin = async function isAdmin(req, res, next) {
  try {
    let UserId = req.body.id;
    console.log("UserID ", UserId);

    let isAdmin = await db.Session.find({ UserId });

    if (isAdmin.length > 0) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    return res.status(500).json({ isAdmin: false });
  }
};

exports.editCodename = async function editCodename(req, res, next) {
  try {
    let UserId = req.body.UserId;
    let SessionID = req.body.SessionID;
    let newCodename = req.body.newCodename;

    let Session = await db.Session.find({ SessionID });
    if (Session.length > 0) {
      if (Session[0].UserId === UserId) {
        Session[0].Codename = newCodename;
      } else {
        let nUser = { Codename: newCodename };
        Session[0].Participants = Session[0].Participants.filter((user) => {
          if (user.id === UserId) {
            nUser = {
              id: user.id,
              email: user.email,
              ...nUser,
              session: user.session,
            };
          }
          return user.id !== UserId;
        });

        Session[0].Participants.push(nUser);
      }

      let save = await Session[0].save();
      if (save.SessionID != undefined) {
        let Participants = generateParticipants(save);

        return res
          .status(200)
          .json({ status: "success", Participants, newCodename });
      } else {
        console.log(save);
        res.status(500).json({ status: "failed" });
      }
    } else {
      res.status(500).json({ status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
};

function generateParticipants(save) {
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

  return Participants;
}

exports.deleteSession = async function deleteSession(req, res, next) {
  try {
    let UserId = req.body.UserId;
    let SessionID = req.body.SessionID;

    let findSession = await db.Session.find({ SessionID });

    if (findSession.length > 0) {
      if (findSession[0].UserId === UserId) {
        let save = await findSession[0].remove();
        console.log(save);
        if (save.SessionID !== undefined) {
          return res.status(200).json({ status: "success" });
        } else {
          return res.status(200).json({ status: "failed" });
        }
      } else {
        return res.status(200).json({ status: "success" });
      }
    } else {
      return res.status(500).json({ status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
};
