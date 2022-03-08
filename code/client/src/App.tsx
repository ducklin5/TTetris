import {connected} from 'process';
import React, { useState, useEffect, useRef} from 'react';
import {GameCanvasComponent} from './components/game_canvas_component';
import { io, Socket } from "socket.io-client";
import './App.css';
import { useRefDimensions } from './util.js/react_util';
import { ResponsiveGameCanvasComponent } from './components/responsive_game_canvas_component';
import { generateMockGameData } from './util.js/mock';

const App = () => {
	console.log("App: Draw");
	const [socket, setSocket] = useState<null | Socket>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
			console.log("App: useEffect");
			const newSocket = io();
			setSocket(newSocket);
			newSocket.on("connect", () => setConnected(true));
			newSocket.on("connect_error", () => setConnected(false));
			setConnected(newSocket.connected);

			return () => {
				newSocket.close()
			};
		}, [setSocket]
	);
	
	

	const mockGameData = generateMockGameData();
	console.log(mockGameData);
	

	return (
		<div className="App">
			<header className="Header">
				<p>
					This is a Proof of Concept App for ECE493W22G7 Capstone Project
				</p>
			</header>
			<ResponsiveGameCanvasComponent gameData={mockGameData} />
		</div>
	);
};

export default App;
