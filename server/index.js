const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { addSession } = require("./helpers/dbOps");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

var participants = [];

io.on("connection", async (socket) => {
  const SessionId = socket.handshake.query.SessionId;
  const UserId = socket.handshake.query.UserId;
  const Email = socket.handshake.query.email;
  const date = socket.handshake.query.date;

  const Session = await addSession(SessionId, Email, UserId, date, []);
  console.log(Session);

  if(Session.SessionID){
    socket.join(Session.SessionID)
    socket.emit("creator-join",Session.UserId)
    socket.broadcast.to(Session.SessionID).emit("announcement",)
  }
  

  socket.on("enter-chat", (name) => {
    participants.push({ id: socket.id, name: name });

    socket.broadcast.emit("new-participant", name);
  });

  socket.on("disconnect", () => {
    participants = [...participants.filter((user) => user.id !== socket.id)];
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
