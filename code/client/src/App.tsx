import {connected} from 'process';
import React, { useState, useEffect} from 'react';
import { io, Socket } from "socket.io-client";
import './App.css';


interface StringMap { [key: string]: string; }
interface ControlProps {
	socket: Socket
}

const Controls = ({socket}: ControlProps) => {
	console.log("Controls: Draw");
	const [counter_name, setCountName] = useState("None");
	const [count, setCount] = useState(0);
	const disabled = counter_name === "None";

	useEffect(() => {
		console.log("Controls: useEffect");
		const counterDataListener = (data: StringMap) => {
			const cname = data["name"];
			const amount = data["amount"];
			setCountName(cname);
			setCount(parseInt(amount));
		};
		socket.on('counter_data', counterDataListener);

		return () => {
			socket.off('counter_data', counterDataListener);
		};
	}, [socket]);
	
	const joinGame = () => {
		const counter_name = prompt("Please choose a counter name (new or existing):");
		console.log("requesting a counter...");
		socket.emit('request_counter', counter_name);
	};

	const incrementCounter = () => {
		console.log("requesting a increment...");
		socket.emit('increment_counter', counter_name);
	};

	const decrementCounter = () => {
		console.log("requesting a decrement...");
		socket.emit('decrement_counter', counter_name);
	};

	return (
		<div>
			<button
				onClick={joinGame}
			>
				Click here to join a game/room
			</button>
			<div className="counterBox">
				<span>{counter_name}</span>
				<span>{count}</span>
				<button onClick={incrementCounter} disabled={disabled}> + </button>
				<button onClick={decrementCounter} disabled={disabled}> - </button>
			</div>
		</div>
	);

}

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
	
	return (
		<div className="App">
			<header className="App-header">
				<p>
					This is a Proof of Concept App for ECE493W22G7 Capstone Project
				</p>
				{ socket && connected ? 
					(<Controls socket={socket} />) :
					(<div>Not Connected</div>)
				}
			</header>
		</div>
	);
};

export default App;
