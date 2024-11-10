import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer} from 'socket.io';
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
  console.log("client connected")

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
      const connectedClients = roomSessions[roomID]?.getConnectedClients();
      if (connectedClients.length >= 5) {
        done("full");
      } else {
        const client = roomSessions[roomID]?.addClient(socket.id, false);
        socket.join(roomID);
        clientId = client.getClientID();
        clientRoomId = roomID;
        done(roomExists, clientId);
        roomSessions[roomID]?.channel.emit("connectClient", roomSessions[roomID].getConnectedClients());
      }
    } catch (err) {
      done(!roomExists);
    }
  });


  // FRMARKER: FR02: Start.Game.Session
  socket.on("start_game", (settings, done) => {
    try {
      roomSessions[clientRoomId].startGame(settings);
      done(true);
    } catch (err) {
      console.log(err);
      done(false);
    }
  })

  // FRMARKER: FR28: Send.GameState 
  socket.on("game_input", (event, done = ()=>{}) => {
    try {
      let succ = roomSessions[clientRoomId]?.gameInput(clientId, event);
      done(succ);
    } catch (err) {
      done(false);
    }
  })

  // get a single client's information by ID
  socket.on("getClientInfo", (roomID, clientID, done) => {
    try {
      let client = roomSessions[roomID]?.getClientByID(clientID);
      done(client);
    } catch (err) {
      console.log(err);
      done(null);
    }
  })

  // get chat messages
  socket.on("getMessage", (roomID, done) => {
    try {
      done(roomSessions[roomID]?.chatSession?.chatHistory);
    } catch (err) {
      console.log(err);
      done(null);
    }
  })

  // send chat message, and return the message to all clients
  socket.on("sendMessage", (roomID, message, clientID, done) => {
    try {
      let nickname = roomSessions[roomID]?.getClientByID(clientID).nickname;
      let date = new Date();
      let time = date.getHours() + ":" + date.getMinutes();
      roomSessions[roomID]?.chatSession.addChat(message, nickname, time);
      done()
      roomSessions[roomID]?.channel.emit("sendMessageAll", roomSessions[roomID].chatSession.chatHistory);
    } catch {
      console.log(err);
    }
  })
  
  // FRMARKER: FR14:Display.Player.Connection.Status
  // get all clients that are connected
  socket.on("getConnectedClients", (roomID, done) => {
    done(roomSessions[roomID]?.getConnectedClients());
  })

  // change client's color
  socket.on("changeClientColor", (roomID, clientID, newColor) => {
    roomSessions[roomID]?.changeClientColor(clientID, newColor);
    roomSessions[roomID]?.channel.emit("connectClient", roomSessions[roomID].getConnectedClients());
  })

  // change client's nickname
  socket.on("changeClientName", (roomID, clientID, newNickName) => {
    roomSessions[roomID]?.changeClientName(clientID, newNickName);
    roomSessions[roomID]?.channel.emit("connectClient", roomSessions[roomID].getConnectedClients());
  })

  // FRMARKER: FR07: Connect.WebRTC.Session
  // signaling for WebRTC
  socket.on("sendSignal", payload => {
    socket.to(payload.userToSignal).emit("userJoined", {signal: payload.signal, callerID: payload.callerID});
  });

  // FRMARKER: FR07: Connect.WebRTC.Session
  // signaling for WebRTC
  socket.on("returnSignal", payload => {
    socket.to(payload.callerID).emit("receiveReturnSignal", {signal: payload.signal, id: socket.id})
  });

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => {
      // disconnect client in room session
      if (roomSessions[room]) {
        roomSessions[room]?.disconnectClient(socket.id);
      }
      // end socket session
      socket.to(room).emit("end_session")
    });
  });
})

export default httpServer;
