const db = require("../models/index");

exports.validate = async function validateMail(req, res, next) {
  const Email = req.body.Email;
  const SessionID = req.body.SessionId;

  console.log(Email);

  if (Email !== undefined) {
    var checkSession = await db.Session.find({ Email });
  } else {
    var checkSession = await db.Session.find({ SessionID });
  }

  if (checkSession.length !== 0) {
    console.log(checkSession[0]);
    let currentDate = new Date();
    let { id, Date: SessionDate } = checkSession[0];

    if (currentDate.getTime() > SessionDate) {
      //Delete Entry
      await checkSession[0].remove();
      return res.status(200).json({ exists: false });
    } else {
      if (SessionID !== undefined) {
        return res.status(200).json({ exists: true, Date: SessionDate });
      } else {
        return res.status(200).json({ exists: true });
      }
    }
  } else {
    return res.status(200).json({ exists: false });
  }
};
