import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { RoomSession } from './room/room_session.js';

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

let roomSessions = {};

wsServer.on("connection", (socket) => {
  socket.on("create_room", (roomID, done) => {
  // TODO: generate room id, playerid, etc.
    console.log(roomID)
    roomSessions[roomID] = new RoomSession(roomID);
    roomSessions[roomID].addClient(true);
    socket.join(roomID);
    done();
  })

  socket.on("join_room", (roomID, done) => {
    let roomExists = true;
    try {
      roomSessions[roomID].addClient(false);
      socket.join(roomID);
      console.log(roomSessions)
      done(roomExists); 
    } catch(err) {
      done(!roomExists);
    }
  });

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => socket.to(room).emit("end_session"));
  });
})

export default server;