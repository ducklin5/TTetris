import express from 'express';
import cors from 'cors';
import http from 'http';
import SocketIO from 'socket.io';

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
const wsServer = SocketIO(server);

wsServer.on("connection", (socket) => {
  socket.on("generate_room", (done) => {
    // TODO: generate room id, playerid, etc.
  })

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done("Joined room");
    socket.to(roomName).emit("welcome");
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(roon).emit("end_session"));
  });
})