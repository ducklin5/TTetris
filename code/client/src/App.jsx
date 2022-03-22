import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import HomePage from './pages/homepage/homepage';
import RoomPage from './pages/roompage/roompage';
import HelpPage from './pages/helppage/helppage';
import { io } from "socket.io-client";

const port = process.env.PORT || 8080;
const wsAddress = window.location.protocol + '//' + window.location.hostname + ':' +port
const socket = io.connect(wsAddress);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage socket={socket}/>} />
        <Route path="/room/:roomID" element={<RoomPage socket={socket}/>} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

