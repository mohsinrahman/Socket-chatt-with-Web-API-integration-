const express = require("express");
const app = express();
const http = require("http").Server(app);

const { generateMessage, generateLocationMessage, generateGif, generateNpa, generateWeather, generateCorona } = require("./utils/messages");
const io = require("socket.io")(http, { pingTimeout: 25000 });
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const port = 3000 || process.env.PORT;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));

    socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
    io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room)});
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("sendGif", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("gif", generateGif(user.username, message));
    callback();
  });

  socket.on("sendNPA", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("npa", generateNpa(user.username, message));
    callback();
  });

  socket.on("sendCorona", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("corona", generateCorona(user.username, message));
    callback();
  });

  socket.on("sendWeather", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("weather", generateWeather(user.username, message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("locationMessage", generateLocationMessage( user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)    );
    callback();
  });

  

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

http.listen(port, () => console.log("Connecting to port" + port));
