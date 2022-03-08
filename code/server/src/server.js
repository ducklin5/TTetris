import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (_, res) => {
  res.status(200).send('');
});

app.get('/version', (_, res) => {
  res.status(200).send("0.1.0");
});

const server = http.createServer(app);
const wsServer = new Server(server, {
  cors: "*"
});

wsServer.on("connection", (socket) => {
  socket.on("create_room", (roomID, done) => {
  // TODO: generate room id, playerid, etc.
    socket.join(roomID);
    done("mesageawe");
  })

  socket.on("join_room", (roomID, done) => {
    console.log(roomID)
    socket.join(roomID);
    done("Joined room");
    socket.to(roomID).emit("welcome");
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("end_session"));
  });
})

export default server;