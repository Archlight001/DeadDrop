const express = require("express");
const router = express.Router({ mergeParams: true });
const { validate,getParticipants,addParticipant,isAdmin} = require("../handlers/session");

router.post("/validate", validate);
router.post("/getParticipants",getParticipants)
router.post("/addParticipant",addParticipant)
router.post("/isAdmin",isAdmin)

module.exports = router;
