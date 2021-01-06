const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validate,
  getParticipants,
  addParticipant,
  isAdmin,
  deleteParticipant,
  editCodename,
} = require("../handlers/session");

router.post("/validate", validate);
router.post("/getParticipants", getParticipants);
router.post("/addParticipant", addParticipant);
router.post("/deleteParticipant", deleteParticipant);
router.post("/isAdmin", isAdmin);
router.post("/editCodename", editCodename);

module.exports = router;
