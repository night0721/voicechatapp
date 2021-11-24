require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3001;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fetch = require("node-fetch");
const db = require("./models/user");
const session = require("express-session");
const passport = require("passport");
const strategy = require("./strategies/discord");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(e => console.log(e));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require("cors")());
app.use(express.json());
app.use(
  session({
    secret: "NYXCat",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
    },
    resave: false,
    saveUninitialized: false,
    name: "hexachat-auth",
  })
);
app.use(passport.initialize());
app.use(passport.session());
const users = {};
io.on("connection", socket => {
  socket.on("userCreate", async username => {
    const user = users[socket.id];
    const data = await fetch(`${process.env.URI}/api/users/create`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ username }),
    }).then(res => res.json());
    if (data.error) socket.broadcast.emit("userExisted", username);
    else {
      socket.broadcast.emit("userConnected", data.username);
      // socket.join(roomId);
      // socket.to(roomId).broadcast.emit("userConnected", userId);
    }
  });
  socket.on("messageCreate", async message => {
    const data = await db.findOne({ username: message.user.username });
    socket.broadcast.emit("sendMessage", {
      message: message.content,
      user: {
        id: data.id,
        username: message.user.username,
      },
    });
  });
  socket.on("disconnect", () => {
    // socket.to(roomId).broadcast.emit("userDisconnected", userId);
    //socket.broadcast.emit("userDisconnected", users[socket.id]);
  });
});
// For message passing
// socket.on("message", function (data) {
//   io.sockets.to(data.toUsername).emit("message", data.data);
// });
app.use("/api", require("./api/router"));
function authorized(req, res, next) {
  if (req.user) next();
  else res.redirect("/login");
}
app.get("/", authorized, (req, res) => {
  res.render("room", { roomId: randomid(16), username: req.user.username });
  // res.redirect(`/room/${randomid(16)}`);
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/room/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

http.listen(port, () => {
  console.log(`Chat Server listening on http://localhost:${port}`);
});
function randomid(length = 10) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
