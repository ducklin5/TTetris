import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { RoomSession } from './room/room_session.js';
import { v4 as uuidv4 } from "uuid";
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json())

let clientPath = path.join(__dirname, '../../client');

app.use(express.static(path.join(clientPath, 'build')));

app.use((req, res, next) => {
  res.sendFile(path.join(clientPath, 'build/index.html'));
});

const httpServer = http.createServer(app);
const wsServer = new IOServer(httpServer, {
  cors: "*"
});

let roomSessions = {};

wsServer.on("connection", (socket) => {
  let clientId = null;
  let clientRoomId = null;

  socket.on("create_room", (done) => {
    // TODO: generate room id, playerid, etc.
    const roomID = uuidv4().substring(0,4);
    console.log(roomID)
    roomSessions[roomID] = new RoomSession(roomID, wsServer.to(roomID));
    roomSessions[roomID].addClient(true);
    socket.join(roomID);
    const client = roomSessions[roomID].getMostRecentClient();
    clientId = client.getClientID();
    clientRoomId = roomID;
    done(roomID, clientId);
  })

  socket.on("join_room", (roomID, done) => {
    let roomExists = true;
    try {
      roomSessions[roomID].addClient(false);
      socket.join(roomID);
      console.log(roomSessions)
      const client = roomSessions[roomID].getMostRecentClient();
      clientId = client.getClientID();
      clientRoomId = roomID;
      done(roomExists, clientId);
    } catch (err) {
      done(!roomExists);
    }
  });

  socket.on("start_game", (done) => {
    try {
      roomSessions[clientRoomId].startGame();
      done(true);
    } catch (err) {
      console.log(err);
      done(false);
    }
  })

  socket.on("game_input", (event) => {
    roomSessions[clientRoomId].gameInput(clientId, event);
  })

  socket.on("getClientInfo", (roomID, clientID, done) => {
    let client = roomSessions[roomID].getClientByID(clientID);
    done(client);
  })

  socket.on("getMessage", (roomID, done) => {
    done(roomSessions[roomID].chatSession.chatHistory);
  })

  socket.on("sendMessage", (roomID, message, clientID, done) => {
    let nickname = roomSessions[roomID].getClientByID(clientID).nickname;
    roomSessions[roomID].chatSession.addChat(message, nickname, "11:11");
    done(roomSessions[roomID].chatSession.chatHistory);
    roomSessions[roomID].channel.emit("sendMessageAll", roomSessions[roomID].chatSession.chatHistory);
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => socket.to(room).emit("end_session"));
  });
})

export default httpServer;