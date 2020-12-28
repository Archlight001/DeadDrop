const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { addSession } = require("./helpers/dbOps");
const { addUser } = require("./helpers/users");

const sessionRoutes = require("./routes/session");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", sessionRoutes);

var participants = [];

io.on("connection", async (socket) => {
  // if(Session.SessionID){
  //   socket.join(SessionId)

  //   socket.emit("creator-join",Session.UserId)
  //   socket.broadcast.to(Session.SessionID).emit("announcement",)
  // }

  socket.on("enter-chat", async (data) => {
    const SessionId = data.SessionId;
    const UserId = data.UserId;
    const Email = data.Email;
    const date = data.date;

    const Session = await addSession(SessionId, Email, UserId, date, []);

    console.log(data);
    // socket.broadcast.emit("new-participant", name);
  });

  socket.on("disconnect", () => {
    participants = [...participants.filter((user) => user.id !== socket.id)];
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
