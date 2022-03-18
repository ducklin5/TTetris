import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { RoomSession } from './room/room_session.js';
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (_, res) => {
  res.status(200).send('');
});

app.get('/version', (_, res) => {
  res.status(200).send("0.1.0");
});

const httpServer = http.createServer(app);
const wsServer = new IOServer(httpServer, {
  cors: "*"
});

let roomSessions = {};

wsServer.on("connection", (socket) => {
  socket.on("create_room", (done) => {
    // TODO: generate room id, playerid, etc.
    const roomID = uuidv4().substring(0,4);
    console.log(roomID)
    roomSessions[roomID] = new RoomSession(roomID, socket);
    roomSessions[roomID].addClient(true);
    socket.join(roomID);
    const client = roomSessions[roomID].getMostRecentClient();
    done(roomID, client.getClientID());
  })

  socket.on("join_room", (roomID, done) => {
    let roomExists = true;
    try {
      roomSessions[roomID].addClient(false);
      socket.join(roomID);
      console.log(roomSessions)
      const client = roomSessions[roomID].getMostRecentClient();
      done(roomExists, client.getClientID());
    } catch (err) {
      done(!roomExists);
    }
  });

  socket.on("start_game", (roomID, done) => {
    try {
      roomSessions[roomID].startGame();
      let gameData = roomSessions[roomID].gameSession.getGameData();
      done(gameData);
    } catch (err) {
      done(null);
    }
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => socket.to(room).emit("end_session"));
  });
})

export default httpServer;