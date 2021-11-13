const port = process.env.PORT || 3001;
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("A new client connected");
});
http.listen(port, () => {
  console.log(`Chat Server listening on PORT:${port}`);
});
