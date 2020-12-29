const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { addSession } = require("./helpers/dbOps");
const { addUser,getAllUsers,removeUser } = require("./helpers/users");

const sessionRoutes = require("./routes/session");
const { remove } = require("./models/session");

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

    console.log(Session);
    
    if(Session){
      socket.join(Session.SessionID)
      const user = addUser(UserId, SessionId,socket.id)

      if(user.id !== undefined){
        socket.broadcast.to(Session.SessionID).emit("new-user",user)
      }    
    }

    console.log(getAllUsers());
    // socket.broadcast.emit("new-participant", name);
  });

  socket.on("disconnect", () => {

    console.log("Disconnecting....");
    console.log(removeUser(socket.id))
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
