import {connected} from 'process';
import React, { useState, useEffect, useRef} from 'react';
import {GameCanvasComponent} from './components/game_canvas_component';
import { io, Socket } from "socket.io-client";
import './App.css';
import { useRefDimensions } from './util.js/react_util';

const App = () => {
	console.log("App: Draw");
	const [socket, setSocket] = useState<null | Socket>(null);
	const [connected, setConnected] = useState(false);

	const gameData = {};

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
	
	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [refHeight, refWidth] = useRefDimensions(ref, 100, 100);

	return (
		<div className="App">
			<header className="Header">
				<p>
					This is a Proof of Concept App for ECE493W22G7 Capstone Project
				</p>
			</header>
			<div
				ref={ref}
				className='GameCanvas'>
				<GameCanvasComponent
					gameData={gameData}
					height={refHeight}
					width={refWidth}
					/>
			</div>
		</div>
	);
};

export default App;
