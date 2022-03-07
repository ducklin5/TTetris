import {connected} from 'process';
import { io, Socket } from "socket.io-client";
import './App.css';
import React, { Component } from 'react';
import HomePage from './components/homepage';

function App() {
  return (
    <React.Fragment class="mx-auto" style="width: 200px;">
      <HomePage/>
    </React.Fragment>
  );
}

export default App;

