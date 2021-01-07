var codename = require("codename")();
var db = require("../models/index");
var filters = ["alliterative", "random"];
var lists = ["cities"];

exports.generateCodeName = function () {
  try {
    var name = validateName(codename.generate(filters, lists), []);
    console.log("name is ", name);
    return name[0];
  } catch (error) {
    console.log(error);
  }
};

function validateName(name, sessionCodenames) {
  console.log(name);
  if (sessionCodenames.length === 0) {
    if (Array.from(name[0]).length < 8) {
      return name;
    } else {
      var n = codename.generate(filters, lists);
      return validateName(n, []);
    }
  } else {
    let checkCodenames = sessionCodenames.every(
      (n) => n !== name[0].toLowerCase()
    );
    if (Array.from(name[0]).length < 8 && checkCodenames) {
      return name;
    } else {
      var n = codename.generate(filters, lists);
      return validateName(n, sessionCodenames);
    }
  }
}

exports.generateCodeNameP = async function (SessionID) {
  try {
    let SessionParticipants = await db.Session.find({ SessionID });
    let sessionCodenames = [];
    if (SessionParticipants.length > 0) {
      sessionCodenames.push(SessionParticipants[0].Codename.toLowerCase());
      SessionParticipants[0].Participants.forEach((participant) => {
        sessionCodenames.push(participant.Codename.toLowerCase());
      });

      var name = validateName(
        codename.generate(filters, lists),
        sessionCodenames
      );
      return name[0];
    }
  } catch (error) {
    console.log(error);
  }
};
