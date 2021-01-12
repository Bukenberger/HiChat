require("dotenv").config();
const moment = require("moment");
const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const port = process.env.PORT || 5000;
const clientHandler = require("./clientModule");

// let app = express();
let server = http.createServer(app);
let io = socketIO(server);
// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
// app.enable("trust proxy");
// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
app.use((req, res, next) => {
  req.secure
    ? // request was via https, so do no special handling
      next()
    : // request was via http, so redirect to https
      res.redirect("https://" + req.headers.host + req.url);
});

// app.use(express.static("public"));

// main socket routine
io.on("connection", (socket) => {
  console.log("new connection established");
  // display a list of rooms to the client before joining
  socket.emit("displayrooms", clientHandler.getRooms());

  // client has joined
  socket.on("join", (client) => {
    if (clientHandler.userExists(client.chatName)) {
      socket.emit("nameexists", {
        text: `name already taken, try a different name.`,
      });
    } else {
      clientHandler.addUser(client.chatName, client.roomName);
      clientHandler.addRoom(client.roomName);

      socket.name = client.chatName;
      socket.room = client.roomName;

      socket.emit("displayonline", clientHandler.getOnlineList(socket.room));

      // use the room property to create a room
      socket.join(client.roomName);
      // send message to joining client
      socket.emit("welcome", {
        time: moment.utc().subtract(4, "hours").format("h:mm:ss a"),
        room: socket.room,
        from: "Admin",
        colour: "#475a9e",
        text: `Welcome ${socket.name}`,
      });
      // send message to rest of the room the client just joined
      socket.to(socket.room).emit("someonejoined", {
        time: moment.utc().subtract(4, "hours").format("h:mm:ss a"),
        room: socket.room,
        from: "Admin",
        colour: "#475a9e",
        text: `${socket.name} has joined this room`,
      });
    }
  }); // join
  // scenario 2 - client disconnects from server
  socket.on("disconnect", async () => {
    if (socket.name !== undefined) {
      clientHandler.removeUser(socket.name, socket.room);
      socket
        .to(socket.room)
        .emit("displayonline", clientHandler.getOnlineList(socket.room));
      // send message to rest of the room the client just left
      socket.to(socket.room).emit("someoneleft", {
        time: moment.utc().subtract(4, "hours").format("h:mm:ss a"),
        room: socket.room,
        from: "Admin",
        colour: "#475a9e",
        text: `${socket.name} has left this room`,
      });
    }
  }); // disconnect
  // scenario 3 - client starts typing
  socket.on("typing", async (clientData) => {
    // send message to rest of the room a user is typing
    socket.to(socket.room).emit("someoneistyping", {
      text: `${clientData.from} is typing...`,
    });
  }); // typing

  socket.on("message", async (clientData) => {
    // send user message to client
    socket.emit("newmessage", {
      time: moment.utc().subtract(4, "hours").format("h:mm:ss a"),
      room: socket.room,
      from: socket.name,
      colour: clientHandler.getUserColour(socket.name),
      text: clientData.text,
    });
    // send user message to rest of the room
    socket.to(socket.room).emit("newmessage", {
      time: moment.utc().subtract(4, "hours").format("h:mm:ss a"),
      room: socket.room,
      from: socket.name,
      colour: clientHandler.getUserColour(socket.name),
      text: clientData.text,
    });
  }); // message

  socket.on("refreshuserlist", async () => {
    socket.emit("displayonline", clientHandler.getOnlineList(socket.room));
  });
}); // connection

// will pass 404 to error handler
app.use((req, res, next) => {
  const error = new Error("No such route found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});
server.listen(port, () => console.log(`starting on port ${port}`));
