import {connected} from 'process';
import { io, Socket } from "socket.io-client";
import './App.css';
import React, { Component, useEffect, useState } from 'react';
import HomePage from './components/homepage/homepage';
import HelpPage from './components/helppage/helppage';

function App() {
  const [socket, setSocket] = useState();
  const [currPage, setCurrPage] = useState("homePage");
  useEffect(() => {
    const newSocket = io("http://127.0.0.1:8080");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [])

  return (
    <React.Fragment class="mx-auto" style="width: 200px;">
      {/* <HomePage socket={socket} /> */}
      <HelpPage/>
    </React.Fragment>
  );
}

export default App;

