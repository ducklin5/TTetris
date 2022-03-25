import { GameSession } from "src/game/game_session";
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
        this.connectedClients = 0;
    }

    addClient(clientID, isHost) {
        // ref: https://css-tricks.com/snippets/javascript/random-hex-color/
        let clientColor = "#"+Math.floor(Math.random()*16777215).toString(16);
        let clientName = `Player${this.clients.length+1}`; 
        let client = new Client(clientID, clientName, clientColor, isHost);
        this.clients.push(client)

        this.connectedClients++;
        return client;
    }

    getClientByID(clientID) {
        for (let client of this.clients) {
            if (client.id == clientID) {
                return client;
            }
        }
    }

    startGame() {
        this.gameSession = new GameSession(this.clients);
        this.gameSession.start(() => this.sendGameDataUpdate());
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

    changeClientColor(clientID, newColor) {
        this.clients.forEach(client => {
            if (client.id == clientID) {
                client.color = newColor;
            }
        })
    }

    getConnectedClients() {
        return this.clients.map(client => {
            if (client.connected == true) {
                return client;
            }
        })
    }

    disconnectClient(clientID) {
        this.clients.forEach(client => {
            if (client.id == clientID) {
                client.connected = false;
                this.connectedClients--;
            }
        })
    }
}

export { RoomSession }

// + isFull: bool
//       + code: string
//       + startGame(): void
//       + addPlayer(): void
//       + generateRoomCode(): void
//       + getChatHistory(): json