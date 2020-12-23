const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

var participants = [];

io.on("connection", (socket) => {
  socket.on("enter-chat", (name) => {
    participants.push({ id: socket.id, name: name });

    socket.broadcast.emit("new-participant",name);
    console.log("New connection ",participants);
  });

  socket.on("disconnect", () => { 
    participants = [...participants.filter(user => (user.id !== socket.id))]
    console.log("After disconnection ", participants);
  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
