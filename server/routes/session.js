const express = require("express");
const router = express.Router({ mergeParams: true });
const { validate,getParticipants,addParticipant} = require("../handlers/session");

router.post("/validate", validate);
router.post("/getParticipants",getParticipants)
router.post("/addParticipant",addParticipant)

module.exports = router;
