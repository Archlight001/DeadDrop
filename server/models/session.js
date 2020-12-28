const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  SessionID: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Participants: {
    type: Array,
    required: true,
  },
});

let Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
