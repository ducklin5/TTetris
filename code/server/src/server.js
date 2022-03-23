import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer, io } from 'socket.io';
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
    const client = roomSessions[roomID].addClient(socket.id, true);
    socket.join(roomID);
    clientId = client.getClientID();
    clientRoomId = roomID;
    done(roomID, clientId);
  })

  socket.on("join_room", (roomID, done) => {
    let roomExists = true;
    try {
      const connectedClients = roomSessions[roomID].getConnectedClients();
      if (connectedClients.length >= 5) {
        done("full");
      } else {
        const client = roomSessions[roomID].addClient(socket.id, false);
        socket.join(roomID);
        clientId = client.getClientID();
        clientRoomId = roomID;
        done(roomExists, clientId);
        roomSessions[roomID].channel.emit("connectClient", roomSessions[roomID].getConnectedClients());
      }
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
    console.log(event);
    roomSessions[clientRoomId].gameInput(clientId, event);
  })

  // get a single client's information by ID
  socket.on("getClientInfo", (roomID, clientID, done) => {
    let client = roomSessions[roomID].getClientByID(clientID);
    done(client);
  })

  // get chat messages
  socket.on("getMessage", (roomID, done) => {
    done(roomSessions[roomID].chatSession.chatHistory);
  })

  // send chat message, and return the message to all clients
  socket.on("sendMessage", (roomID, message, clientID, done) => {
    let nickname = roomSessions[roomID].getClientByID(clientID).nickname;
    roomSessions[roomID].chatSession.addChat(message, nickname, "11:11");
    done()
    roomSessions[roomID].channel.emit("sendMessageAll", roomSessions[roomID].chatSession.chatHistory);
  })

  // get all clients that are connected
  socket.on("getConnectedClients", (roomID, done) => {
    done(roomSessions[roomID].getConnectedClients());
  })

  // change client's color
  socket.on("changeClientColor", (roomID, clientID, newColor) => {
    roomSessions[roomID].changeClientColor(clientID, newColor);
    roomSessions[roomID].channel.emit("connectClient", roomSessions[roomID].getConnectedClients());
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => {
      // disconnect client in room session
      if (roomSessions[room]) {
        roomSessions[room].disconnectClient(socket.id);
      }
      // end socket session
      socket.to(room).emit("end_session")
    });
  });
})

export default httpServer;