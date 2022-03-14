import { v4 as uuidv4 } from "uuid";
import { Client } from "./client.js";

class RoomSession {
    constructor(roomID) {
        this.clients = []; // list of Client object
        // TODO: Create a chat session later on
        // this.chatSession = [];
        this.roomID = roomID;
    }

    addClient(isHost) {
        // ref: https://css-tricks.com/snippets/javascript/random-hex-color/
        let clientColor = Math.floor(Math.random()*16777215).toString(16);
        let clientID = uuidv4();
        let clientName = `Player${this.clients.length+1}`; 
        let client = new Client(clientID, clientName, clientColor, isHost);
        this.clients.push(client)
    }
}

export { RoomSession }

// + isFull: bool
//       + code: string
//       + startGame(): void
//       + addPlayer(): void
//       + generateRoomCode(): void
//       + getChatHistory(): json