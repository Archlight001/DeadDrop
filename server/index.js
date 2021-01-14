const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { findSession } = require("./helpers/dbOps");

const { addUser, getAllUsers, removeUser } = require("./helpers/users");

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

io.on("connection", async (socket) => {

  socket.on("enter-chat", async (data) => {
    const SessionId = data.SessionId;
    const UserId = data.UserId;
    const Email = data.Email;
    const Codename = data.Codename;
    const date = data.date;

    const Session = await findSession(SessionId);

    console.log(Session);

    if (Session) {
      socket.join(`${Session.SessionID}`);
      const user = addUser(UserId, SessionId, socket.id,Codename);

      if (user.id !== undefined) {
        console.log("Broadcasting");
        io.to(`${Session.SessionID}`).emit("new-user", `${Codename} has joined the group`);
      }
    }

    console.log(getAllUsers());
    // socket.broadcast.emit("new-participant", name);
  });

  socket.on("get-participants", () => {
    let users = getAllUsers().map((user) => user.id);
    socket.emit("get-participants", users);
  });

  socket.on("disconnect", () => {
    console.log("Disconnecting....");
    let user = removeUser(socket.id);
    //console.log(`${user.codename} has been removed`);
    if(user !== undefined){
      io.to(`${user.session}`).emit("user-exit", `${user.codename} has left the group`);
    }
    
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
