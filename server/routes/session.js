const express = require("express");
const router = express.Router({ mergeParams: true });
const { validate} = require("../handlers/session");

router.post("/validate", validate);

module.exports = router;
