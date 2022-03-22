import { GameSession } from "src/game/game_session";
import { v4 as uuidv4 } from "uuid";
import { Client } from "./client.js";
import ChatSession  from "./chat_session.js";

class RoomSession {
    constructor(roomID,  channel) {
        this.clients = []; // list of Client object
        // TODO: Create a chat session later on
        this.chatSession = new ChatSession();
        this.roomID = roomID;
        this.gameSession = null;
        this.channel = channel;
    }

    addClient(isHost) {
        // ref: https://css-tricks.com/snippets/javascript/random-hex-color/
        let clientColor = "#"+Math.floor(Math.random()*16777215).toString(16);
        let clientID = uuidv4();
        let clientName = `Player${this.clients.length+1}`; 
        let client = new Client(clientID, clientName, clientColor, isHost);
        this.clients.push(client)
    }

    getClientByID(clientID) {
        for (let client of this.clients) {
            if (client.id == clientID) {
                return client;
            }
        }
    }

    getMostRecentClient() {
        return this.clients[this.clients.length-1];
    }

    startGame() {
        this.gameSession = new GameSession(this.clients);
        this.gameSession.run(() => this.sendGameDataUpdate());
        this.channel.emit("gameStarted", this.gameSession.getGameData());
    }

    sendGameDataUpdate() {
        this.channel.emit("gameDataUpdated", this.gameSession.getGameData());
    }

    gameInput(clientId, event) {
        if (this.gameSession.inputEvent(clientId, event)) {
            this.sendGameDataUpdate();
        }
    }
}

export { RoomSession }

// + isFull: bool
//       + code: string
//       + startGame(): void
//       + addPlayer(): void
//       + generateRoomCode(): void
//       + getChatHistory(): json