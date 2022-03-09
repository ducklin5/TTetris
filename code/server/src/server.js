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

let count;
wsServer.on("connection", (socket) => {
  socket.on("create_room", (roomID, done) => {
  // TODO: generate room id, playerid, etc.
    count = 0;
    socket.join(roomID);
  })

  socket.on("join_room", (roomID, done) => {
    console.log(roomID)
    socket.join(roomID);
    done("Joined room");
    socket.to(roomID).emit("count", count);
    console.log("emited")
  });

  socket.on("count", (cnt, roomID, done) => {
    cnt += 1;
    count = cnt;
    console.log(count)
    console.log(roomID);
    socket.to(roomID).emit("count", count);
    done()
  })

  socket.on("disconnecting", () => {
    console.log("disconnecting")
    socket.rooms.forEach(room => socket.to(room).emit("end_session"));
  });
})

export default server;