const express = require("express");
var bodyParser = require("body-parser");
const http = require("http");
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/messages");
const usersRouter = require("./routes/users");
const authenticate = require("./middleware/authentication");
const connectDB = require("./db/connect");
const socketio = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

require("dotenv").config(); //for setting environment variables on server
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000 || process.env.PORT;
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use("/auth", authRouter);
app.use("/messages", authenticate, messagesRouter);
app.use("/users", authenticate, usersRouter);

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (id) => {
    socket.join(id);
  });
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
  socket.on("callUser", (roomId) => {
    socket.to(roomId).emit("calling");
  });
  socket.on("chatMessage", (roomId, message, currentUser) => {
    socket.to(roomId).emit("message", message, currentUser);
  });
});

server.listen(PORT, async () => {
  connectDB(process.env.MONGO_URI);
  console.log(`Server is listening on port ${PORT}`);
});
