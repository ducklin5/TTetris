import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import React, { useEffect, useState } from 'react';
import HomePage from './components/homepage/homepage';
import RoomPage from './components/roompage/roompage';
import HelpPage from './components/helppage/helppage';
import { io } from "socket.io-client";

const socket = io.connect('http://127.0.0.1:8080');

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

