import { GameSession } from "src/game/game_session";
import { v4 as uuidv4 } from "uuid";
import { Client } from "./client.js";

class RoomSession {
    constructor(roomID, socket) {
        this.clients = []; // list of Client object
        // TODO: Create a chat session later on
        // this.chatSession = [];
        this.roomID = roomID;
        this.gameSession = null;
        this.socket = socket;
    }

    addClient(isHost) {
        // ref: https://css-tricks.com/snippets/javascript/random-hex-color/
        let clientColor = "#"+Math.floor(Math.random()*16777215).toString(16);
        let clientID = uuidv4();
        let clientName = `Player${this.clients.length+1}`; 
        let client = new Client(clientID, clientName, clientColor, isHost);
        this.clients.push(client)
    }

    getMostRecentClient() {
        return this.clients[this.clients.length-1];
    }

    startGame() {
        this.gameSession = new GameSession(this.clients, this.socket);
        this.gameSession.run();
    }
}

export { RoomSession }

// + isFull: bool
//       + code: string
//       + startGame(): void
//       + addPlayer(): void
//       + generateRoomCode(): void
//       + getChatHistory(): json