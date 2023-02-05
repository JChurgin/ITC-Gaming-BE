const express= require("express");
const cors= require("cors");
const usersRoute= require("./routes/usersRoute");
const http = require('http');
const socketIO = require('socket.io');


const profileRoutes = require("./routes/profileRoutes");

const scoreRoutes = require("./routes/scoreRoutes");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config();
require("./database/mongoose");
app.use(express.json());
app.use(express.static("images"));
app.use(cors());
app.use("/api/users", usersRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/score", scoreRoutes);

io.on('connection', socket => {
  console.log('new client connected');

  setTimeout(() => socket.emit('bla', 'Hello User!'), 2000);

  socket.on('greeting', data => {
    console.log(data);
    socket.emit('bla', 'fuck you')
  })
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
