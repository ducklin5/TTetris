import {connected} from 'process';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { io, Socket } from "socket.io-client";
import './App.css';
import React, { Component, useEffect, useState } from 'react';
import HomePage from './components/homepage/homepage';
import HelpPage from './components/helppage/helppage';


const socket = io.connect('http://127.0.0.1:8080');
function App() {
  const [socket, setSocket] = useState();
  const [currPage, setCurrPage] = useState("homePage");
  useEffect(() => {
    const newSocket = io("http://127.0.0.1:8080");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [])

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage socket={socket}/>} />
      <Route path="/help" element={<HelpPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;

