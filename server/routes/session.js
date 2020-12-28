const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateMail } = require("../handlers/session");

router.post("/validatemail", validateMail);

module.exports = router;
