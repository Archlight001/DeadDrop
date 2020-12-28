const db = require("../models/index");

exports.validateMail = async function validateMail(req, res, next) {
  const Email = req.body.Email;
  var checkSession = await db.Session.find({ Email });

  if (checkSession.length !== 0) {
    console.log(checkSession[0]);
    let currentDate = new Date();
    let { id, Date:SessionDate } = checkSession[0];
    
    if (currentDate.getTime() > SessionDate) {
      //Delete Entry
      await checkSession[0].remove()
      return res.status(200).json({exists:false});
    } else {
      return res.status(200).json({ exists: true});
    }
  } else {
    return res.status(200).json({exists:false});
  }

};
