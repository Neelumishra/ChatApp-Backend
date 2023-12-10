const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const port = 4500 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());
const users = [{}];
io.on("connection", (socket) => {
  console.log(socket);
  socket.on("joined", ({ value }) => {
    users[socket.id] = value;
    console.log(users);
    console.log(`${value} has joined`);

    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]}  has Joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the Chat ${users[socket.id]}`,
    });
  });
  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} left chat`,
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hi this is wroking");
});

app.post("/register", (req, res) => {
  res.send("Hi this is register");
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
